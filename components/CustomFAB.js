import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet,} from 'react-native';

import {AnimatedFAB} from 'react-native-paper';

const CustomFAB = (
    {
        animatedValue,
        visible,
        extended,
        label,
        animateFrom,
        style,
        iconMode,
    }) => {

    const [isExtended, setIsExtended] = useState(true);
    const isIOS = Platform.OS === 'ios';

    useEffect(() => {
        if (!isIOS) {
            animatedValue.addListener(({value}) => {
                setIsExtended(value <= 0);
            });
        } else setIsExtended(extended);
    }, [animatedValue, extended, isIOS]);

    const fabStyle = {[animateFrom]: 16};

    return (
        <AnimatedFAB
            icon={'play'}
            label={label}
            extended={isExtended}
            onPress={() => console.log('Pressed')}
            visible={visible}
            animateFrom={animateFrom}
            iconMode={iconMode}
            style={[styles.fabStyle, style, fabStyle]}
        />
    );
};

export default CustomFAB;

const styles = StyleSheet.create({
    fabStyle: {
        bottom: 16,
        position: 'absolute',
    },
});