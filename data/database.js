import * as SQLite from 'expo-sqlite';

const Database = {
    storage: null,
    openDatabase() {
        this.storage = SQLite.openDatabase('road-vision');
    },
    createTrip({startTimestamp, endTimestamp, distance_km}) {
        return new Promise((resolve, reject) => {
            this.storage.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO Trips (start_timestamp, end_timestamp, distance_km) VALUES (?, ?, ?)',
                    [startTimestamp, endTimestamp, distance_km],
                    (_, result) => {
                        resolve(result.insertId);
                    },
                    (_, error) => {
                        reject('Ошибка при вставке данных Trips:', error);
                    }
                );
            });
        });
    },
    createGeoData(tripId, {latitude, longitude, timestamp, photo_path}) {
        return new Promise((resolve, reject) => {
            this.storage.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO GeoData (trip_id, latitude, longitude, timestamp, photo_path) VALUES (?, ?, ?, ?, ?)',
                    [tripId, latitude, longitude, timestamp, photo_path],
                    (_, result) => {
                        resolve('Данные успешно вставлены в таблицу GeoData.');
                    },
                    (_, error) => {
                        reject('Ошибка при вставке данных GeoData:', error);
                    }
                );
            });
        });
    },
    fetchAllData(){
        return new Promise((resolve, reject) => {
            this.storage.transaction(tx => {
                tx.executeSql(
                    'SELECT Trips.*, GeoData.* FROM Trips LEFT JOIN GeoData ON Trips.id = GeoData.trip_id',
                    [],
                    (_, result) => {
                        const dataWithJoin = result.rows._array;
                        resolve(dataWithJoin);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    },
    fetchTrips(){
        return new Promise((resolve, reject) => {
            this.storage.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM Trips',
                    [],
                    (_, result) => {
                        const data = result.rows._array;
                        resolve(data);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    },
    updateTrip(tripId, property, value){
        return new Promise((resolve, reject) => {
            this.storage.transaction(tx => {
                tx.executeSql(
                    `UPDATE Trips SET ${property} = ? WHERE id = ?`,
                    [value, tripId],
                    (_, result) => {
                        const updatedData = result.rows._array;
                        resolve(updatedData);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        })
    },
    closeDatabase(){
        this.storage.closeAsync();
        this.storage = null;
    },
    clearDatabase(){
        this.openDatabase();
        this.storage.transaction(tx => {
            tx.executeSql('DROP TABLE IF EXISTS Trips');
            tx.executeSql('DROP TABLE IF EXISTS GeoData');
        }, null, () => {
            this.closeDatabase();
            console.log('Все таблицы удалены');
        });

    },
    checkStoragePreparation() {
        return new Promise((resolve, reject) => {
            this.storage.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Trips
                     (
                         id              INTEGER PRIMARY KEY AUTOINCREMENT,
                         start_timestamp INTEGER,
                         end_timestamp   INTEGER,
                         distance_km     REAL
                     );`,
                    [],
                    (_, result) => {
                        this.storage.transaction(tx => {
                            tx.executeSql(
                                `CREATE TABLE IF NOT EXISTS GeoData
                                 (
                                     id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                     trip_id    INTEGER,
                                     latitude   REAL,
                                     longitude  REAL,
                                     timestamp  INTEGER,
                                     photo_path TEXT,
                                     FOREIGN KEY (trip_id) REFERENCES Trips (id) ON DELETE CASCADE
                                 );`,
                                [],
                                (_, result) => {
                                    resolve('Таблицы успешно созданы.');
                                },
                                (_, error) => {
                                    reject('Ошибка при создании таблицы "геоданные":', error);
                                }
                            );
                        });

                    },
                    (_, error) => {
                        reject('Ошибка при создании таблицы "поездки":', error);
                    }
                );
            });
        });
    }
}

export default Database;