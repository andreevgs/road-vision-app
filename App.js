import * as React from 'react';
import {PaperProvider} from 'react-native-paper';
import {StatusBar} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from "./screens/MainScreen";
import WorkProcessScreen from "./screens/WorkProcess";
import {useEffect} from "react";
import Database from "./data/database";

const Stack = createNativeStackNavigator();

const App = () => {
    useEffect(() => {
        console.log('bootstrap');
    }, []);
    return (
        <PaperProvider>
            <StatusBar barStyle="dark-content" />
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main">
                    <Stack.Screen name="Main" component={MainScreen}/>
                    <Stack.Screen name="WorkProcess" component={WorkProcessScreen} options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};

export default App;