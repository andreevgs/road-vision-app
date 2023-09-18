import {Portal, Button, Text, Dialog, IconButton} from "react-native-paper";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import {AutoFocus, Camera, CameraType, VideoQuality} from "expo-camera";
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";

const WorkProcessScreen = ({ navigation }) => {
    const [currentOrientation, setCurrentOrientation] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isRecordingMode, setIsRecordingMode] = useState(false);
    const [recordedVideoUri, setRecordedVideoUri] = useState('');
    const cameraRef = useRef(null);
    useEffect(() => {
        ScreenOrientation.getOrientationAsync().then(orientation => {
            setCurrentOrientation(orientation);
        })
    }, []);

    function toggleRecording() {
        isRecordingMode ?
            cameraRef.current.stopRecording() :
            cameraRef.current.recordAsync({quality: VideoQuality["720p"]}).then(video => {setRecordedVideoUri(video.uri); console.log(video.uri)});
        setIsRecordingMode(current => (!current));
    }

    if (!permission) {
        // Camera permissions are still loading
        return <View/>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.permissionsContainer}>
                <Text style={{textAlign: 'center', marginBottom: 20}} variant={'bodyLarge'}>Требуется разрешение для доступа к камере</Text>
                <Button onPress={requestPermission} mode={'contained'} style={{width: 200, marginBottom: 16}}>Разрешить</Button>
                <Button onPress={() => navigation.navigate('Main')} mode={'contained-tonal'} style={{width: 200}}>Назад</Button>
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
                        <Text variant="bodyMedium">Пожалуйста, поверните смартфон горизонтально и установите на крепление</Text>
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
                                <Text style={{color: '#fff'}}>GPS OK</Text>
                                <Text style={{color: '#fff'}}>улица Программистов</Text>
                                {!isRecordingMode && <Text style={{color: '#fff'}}>29 FPS</Text>}
                                {!isRecordingMode && <Text style={{color: '#fff'}}>0 KM/H</Text>}
                                    {!isRecordingMode &&
                                        <Button
                                            mode={'contained'}
                                            onPress={() => navigation.navigate('Main')}
                                        >Закрыть</Button>}
                            </View>
                                <IconButton
                                    animated
                                    mode={'contained'}
                                    icon={isRecordingMode ? 'stop': 'play'}
                                    selected={isRecordingMode}
                                    size={50}
                                    style={styles.recordingButton}
                                    onPress={toggleRecording}
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