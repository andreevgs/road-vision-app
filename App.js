import * as React from 'react';
import {BottomNavigation, PaperProvider, Text} from 'react-native-paper';
import WorksScreen from "./screens/WorksScreen";
import {StatusBar} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from "./screens/MainScreen";
import WorkProcessScreen from "./screens/WorkProcess";

const Stack = createNativeStackNavigator();

const App = () => {

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