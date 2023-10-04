import {Button, Dialog, IconButton, Portal, Text} from "react-native-paper";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import {AutoFocus, Camera, CameraType} from "expo-camera";
import {SafeAreaView, StyleSheet, View} from "react-native";
import * as Location from 'expo-location';
import {Accuracy} from 'expo-location';
import Database from "../data/database";
import * as FileSystem from "expo-file-system";

const WorkProcessScreen = ({navigation}) => {
    const [currentOrientation, setCurrentOrientation] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
    const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
    const [currentPosition, setCurrentPosition] = useState('');
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [isRecordingMode, setIsRecordingMode] = useState(false);
    const watchPositionRemove = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        ScreenOrientation.getOrientationAsync().then(orientation => {
            console.log('orientation: ', orientation);
            setCurrentOrientation(orientation);
        });
        // Location.getCurrentPositionAsync({accuracy: Accuracy.Low, distanceInterval: 10}).then(location => console.log(location));
    }, []);

    function requestPermissions() {
        if (cameraPermission.granted && !locationPermission.granted) {
            requestLocationPermission();
        } else if (!cameraPermission.granted && locationPermission.granted) {
            requestCameraPermission();
        } else {
            requestCameraPermission()
                .then(() => requestLocationPermission());
        }
    }
    let isPictureProcessing = false;
    async function startRecording() {
        try {
            setIsRecordingMode(true);
            await Database.openDatabase();
            await Database.checkStoragePreparation();
            const tripId = await createNewTrip();
            watchPositionRemove.current = await startWatchingLocation(tripId);

        } catch (error) {
            console.error('Произошла ошибка при начале записи:', error);
        }
    }

    async function createNewTrip() {
        const startTimestamp = Date.now();
        const endTimestamp = Date.now();
        const distance_km = 0;
        const tripId = await Database.createTrip({
            startTimestamp,
            endTimestamp,
            distance_km
        });
        setCurrentTrip(tripId);
        return tripId;
    }

    async function startWatchingLocation(tripId) {
        const accuracyOptions = {
            accuracy: Accuracy.BestForNavigation,
            distanceInterval: 5,
        };
        return Location.watchPositionAsync(accuracyOptions, async location => {
            console.log(location);
            if(!isPictureProcessing) {
                try {
                    isPictureProcessing = true;
                    setCurrentSpeed(location.coords.speed);
                    const {uri} = await cameraRef.current.takePictureAsync({imageType: 'jpg'});
                    const fileName = uri.split('/').pop();
                    await FileSystem.copyAsync({from: uri, to: `${FileSystem.documentDirectory}/Camera`});
                    await Database.createGeoData(tripId, {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        timestamp: Date.now(),
                        photo_path: `${FileSystem.documentDirectory}/Camera/${fileName}`,
                    });
                    const address = await Location.reverseGeocodeAsync(location.coords);
                    console.log(address[0].name);
                    setCurrentPosition(address[0].name);
                } catch (error) {
                    console.log('Ошибка при обработке снимка:', error);
                } finally {
                    isPictureProcessing = false;
                }
            }
        });
    }

    function stopRecording() {
        setIsRecordingMode(false);
        watchPositionRemove.current.remove();
        Database.updateTrip(currentTrip, 'end_timestamp', Date.now())
            .then(() => {
                Database.fetchAllData().then((data) => {console.log(data); Database.closeDatabase();});
            })
    }

    if (!cameraPermission || !locationPermission) {
        // permissions are still loading
        return <View/>;
    }

    if (!cameraPermission.granted || !locationPermission.granted) {
        // permissions are not granted yet
        return (
            <View style={styles.permissionsContainer}>
                <Text style={{textAlign: 'center', marginBottom: 20}} variant={'bodyLarge'}>Требуется разрешение для
                    доступа к камере и сервисам геолокации</Text>
                <Button onPress={requestPermissions} mode={'contained'}
                        style={{width: 200, marginBottom: 16}}>Разрешить</Button>
                <Button onPress={() => navigation.navigate('Main')} mode={'contained-tonal'}
                        style={{width: 200}}>Назад</Button>
            </View>
        );
    }
    ScreenOrientation.addOrientationChangeListener((res) => {
        setCurrentOrientation(res.orientationInfo.orientation);
    });

    return (
        <>
            <Portal>
                <Dialog visible={currentOrientation !== 4} dismissable={false}>
                    <Dialog.Title>Новая работа</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Пожалуйста, поверните смартфон горизонтально и установите на
                            крепление</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => navigation.navigate('Main')}>Отмена</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={styles.container}>
                <Camera
                    ref={cameraRef}
                    style={styles.camera}
                    type={type}
                    autoFocus={AutoFocus.on}
                >
                    {currentOrientation === 4 &&
                        <SafeAreaView style={styles.workplace}>
                            <View style={styles.infoSection}>
                                <Text style={{color: '#fff'}}>{currentPosition ? 'GPS OK' : 'GPS Connecting'}</Text>
                                <Text style={{color: '#fff'}}>{currentPosition ? currentPosition : 'N/A'}</Text>
                                {isRecordingMode &&
                                    <Text style={{color: '#fff'}}>{currentSpeed > -1 ? currentSpeed : 0} KM/H</Text>}
                                {!isRecordingMode &&
                                    <Button
                                        mode={'contained'}
                                        onPress={() => navigation.navigate('Main')}
                                    >Закрыть</Button>}
                            </View>
                            <IconButton
                                animated
                                mode={'contained'}
                                icon={isRecordingMode ? 'stop' : 'play'}
                                selected={isRecordingMode}
                                size={50}
                                style={styles.recordingButton}
                                onPress={isRecordingMode ? stopRecording : startRecording}
                            />
                        </SafeAreaView>
                    }
                </Camera>
            </View>
        </>
    )
};

export default WorkProcessScreen;

const styles = StyleSheet.create({
    permissionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
    },
    workplace: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recordingButton: {
        alignSelf: 'center',
    },
});