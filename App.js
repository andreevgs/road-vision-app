import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import {AutoFocus, Camera, CameraType, VideoQuality} from "expo-camera";
import {useRef, useState} from "react";

export default function App() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isRecordingMode, setIsRecordingMode] = useState(false);
    const [recordedVideoUri, setRecordedVideoUri] = useState('');
    const cameraRef = useRef(null);

    function toggleRecording() {
        isRecordingMode ?
            cameraRef.current.stopRecording() :
            cameraRef.current.recordAsync({quality: VideoQuality["720p"]}).then(video => {setRecordedVideoUri(video.uri); console.log(recordedVideoUri)});
        setIsRecordingMode(current => (!current));
    }

    if (!permission) {
        // Camera permissions are still loading
        return <View/>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                type={type}
                autoFocus={AutoFocus.on}
                quality
            >
                {recordedVideoUri && <View>
                    <Text>{recordedVideoUri}</Text>
                </View>}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleRecording}>
                        {isRecordingMode ?
                            <Text style={styles.text}>Stop Recording</Text> :
                            <Text style={styles.text}>Start Recording</Text>}
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
