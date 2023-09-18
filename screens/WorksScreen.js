import {Button, Card, List, ProgressBar, Text} from "react-native-paper";
import {Animated, Platform, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {useRef, useState} from "react";

const WorksScreen = ({ navigation }) => {
    const isIOS = Platform.OS === 'ios';
    const [isFABExtended, setIsFABExtended] = useState(true);
    const { current: velocity } = useRef(
        new Animated.Value(0)
    );
    const onScroll = ({nativeEvent}) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        if (!isIOS) {
            return velocity.setValue(currentScrollPosition);
        }
        setIsFABExtended(currentScrollPosition <= 0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={styles.cardContainer}>
                <Card mode={'elevated'} elevation={1}>
                    <Card.Content style={styles.info}>
                        <View>
                            <Text style={styles.infoBlockProgress} variant={'titleMedium'}>
                                Используется 1 GB памяти устройства
                            </Text>
                            <ProgressBar style={styles.progressBar} progress={0.2}></ProgressBar>
                        </View>
                        <Button mode={'contained'}>Выгрузить (1 GB)</Button>
                    </Card.Content>
                </Card>
            </View>
            <List.Section>
                <List.Subheader>Законченные работы</List.Subheader>
                <List.Item
                    title={'12.04.2023 c 12:30 по 14:40'}
                    description={'123 км, 2 часа 12 минут'}
                    descriptionEllipsizeMode={'middle'}
                    right={() => <List.Icon icon={'cloud-off-outline'}></List.Icon>}
                    onPress={() => console.log('pressed')}
                ></List.Item>
                <List.Item
                    title={'12.04.2023 c 12:30 по 14:40'}
                    description={'123 км, 2 часа 12 минут'}
                    descriptionEllipsizeMode={'middle'}
                    right={() => <List.Icon icon={'cloud-off-outline'}></List.Icon>}
                ></List.Item>
                <List.Item
                    title={'12.04.2023 c 12:30 по 14:40'}
                    description={'123 км, 2 часа 12 минут'}
                    descriptionEllipsizeMode={'middle'}
                    right={() => <List.Icon icon={'cloud-sync'}></List.Icon>}
                ></List.Item>
                <List.Item
                    title={'12.04.2023 c 12:30 по 14:40'}
                    description={'123 км, 2 часа 12 минут'}
                    descriptionEllipsizeMode={'middle'}
                    right={() => <List.Icon icon={'cloud-check'}></List.Icon>}
                ></List.Item>
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