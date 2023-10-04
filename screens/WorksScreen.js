import {Button, Card, List, ProgressBar, Text} from "react-native-paper";
import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import Database from "../data/database";
import {format, formatDistance} from "date-fns";
import ruLocale from "date-fns/locale/ru";
import {getUsedMemoryCapacity} from "../data/filesystem";
import axios from "axios";

const WorksScreen = ({navigation}) => {
    const [trips, setTrips] = useState(null);
    const [capacityInfo, setCapacityInfo] = useState(null);

    useEffect(() => {
        getUsedMemoryCapacity().then(info => {console.log(info); setCapacityInfo(info)});
        fetchTrips();
    }, []);

    async function uploadData() {
        const response = await axios.post('http://192.168.100.41:5000/roads/geodata/upload', {
            geodata: trips
        });
    }
    async function fetchTrips(){
        Database.openDatabase();
        await Database.checkStoragePreparation();
        const tripsData = await Database.fetchTrips();
        setTrips(tripsData.reverse());
        Database.closeDatabase();
    }

    function extractDate(milliseconds){
        const daysDifference = new Date(new Date() - new Date(milliseconds)) / 86400000;
        if(daysDifference < 1)
            return 'Сегодня';
        if(daysDifference < 2)
            return 'Вчера';
        return format(new Date(milliseconds), 'P', {locale: ruLocale});
    }

    function extractTime(milliseconds){
        return format(new Date(milliseconds), 'p', {locale: ruLocale});
    }

    function extractDuration(startMilliseconds, endMilliseconds){
        return formatDistance(
            new Date(startMilliseconds),
            new Date(endMilliseconds),
            {locale: ruLocale}
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.cardContainer}>
                    <Card mode={'elevated'} elevation={1}>
                        <Card.Content style={styles.info}>
                            <View>
                                {capacityInfo ?
                                    <Text style={styles.infoBlockProgress} variant={'titleMedium'}>
                                        Используется {capacityInfo.size} {capacityInfo.measure} памяти устройства
                                    </Text> :
                                    <Text
                                        style={[styles.infoBlockProgress, styles.infoBlockProgressCalculating]}
                                        variant={'titleMedium'}
                                    >
                                        Вычисление
                                    </Text>
                                }
                                <ProgressBar
                                    style={styles.progressBar}
                                    progress={capacityInfo ? capacityInfo.index : 0}></ProgressBar>
                            </View>
                            <Button
                                mode={'contained'}
                                disabled={!trips?.length}
                                onPress={uploadData}
                            >Выгрузить</Button>
                        </Card.Content>
                    </Card>
                </View>
                <List.Section>
                    <List.Subheader>Законченные работы</List.Subheader>
                    {trips && trips.map((trip, i) => (
                        <List.Item
                            key={i}
                            title={`${extractDate(trip.start_timestamp)} с ${extractTime(trip.start_timestamp)} по ${extractTime(trip.end_timestamp)}`}
                            description={`${extractDuration(trip.start_timestamp, trip.end_timestamp)}`}
                            descriptionEllipsizeMode={'middle'}
                            right={() => <List.Icon icon={'cloud-off-outline'}></List.Icon>}
                            onPress={() => console.log('pressed')}
                        ></List.Item>
                    ))}
                </List.Section>
            </ScrollView>
            <View>
                <Button
                    icon={'play'}
                    style={styles.workButton}
                    mode={"contained"}
                    onPress={() => navigation.navigate('WorkProcess')}
                >Начать работу</Button>
            </View>
        </SafeAreaView>
    );
}

export default WorksScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    cardContainer: {
        padding: 16,
    },
    info: {
        rowGap: 16,
    },
    infoBlockProgress: {
        marginBottom: 6,
    },
    infoBlockProgressCalculating: {
        opacity: 0.5,
    },
    progressBar: {
        height: 16,
    },
    scrollView: {
        padding: 14,
    },
    workButton: {
        bottom: 16,
        left: 16,
        right: 16,
        position: 'absolute',
    },
});