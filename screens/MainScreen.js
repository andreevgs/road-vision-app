import {BottomNavigation} from "react-native-paper";
import * as React from "react";
import WorksScreen from "./WorksScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";

const MainScreen = ({navigation}) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'works', title: 'Работа', focusedIcon: 'road-variant'},
        {key: 'profile', title: 'Профиль', focusedIcon: 'account'},
        {key: 'settings', title: 'Настройки', focusedIcon: 'cog'},
    ]);
    const renderScene = BottomNavigation.SceneMap({
        works: () => <WorksScreen navigation={navigation}/>,
        profile: ProfileScreen,
        settings: SettingsScreen,
    });
    return (
        <BottomNavigation
            navigationState={{index, routes}}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}

export default MainScreen;