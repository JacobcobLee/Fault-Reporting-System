import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

function Splash(props) {
    const { navigation } = props
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../images/splash.jpg')}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            <Text>{setTimeout(() => { navigation.replace("Home"); }, 1000)}</Text>
        </View>
    );
}

export default Splash