import React, { Component } from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

// Set the key-value pairs for the different languages you want to support.

export default class AirconPicture extends Component {

    state = {
    }
    componentDidMount() {

    }

    render() {
        return (
            <ScrollView>
                <View>
                    <View>
                        <Text style={styles.text}>Ceiling Cassette/嵌入式空调</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/Ceiling_Cassette.jpg')} />
                    <View>
                        <Text style={styles.text}>Air Cooler/卓面式冷气机</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/Air_Cooler.jpg')} />
                    <View>
                        <Text style={styles.text}>Centralized Aircon/中央空调</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/Centralized_Aircon1.jpg')} />
                    <Image style={styles.imgBackground} source={require('../images/Centralized_Aircon2.jpg')} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    functionbut: {
        flex: 1,
        padding: 30,
        paddingTop: 15,
        flexDirection: 'column',
        marginBottom: 25
    },
    recentfault: {
        paddingTop: 50,
        padding: 13,
    },
    textTop: {
        padding: 25,
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center'
    }
    ,
    icon: {
        color: '#038cfc',
        alignSelf: 'center',
    },
    icon2: {
        color: 'red',
        alignSelf: 'center'
    },
    title: {
        marginBottom: 20,
        fontSize: 25,
        textAlign: 'center'
    },
    itemInput: {
        height: 250,
        padding: 4,
        marginRight: 5,
        fontSize: 23,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black'
    },
    buttonText: {
        fontSize: 18,
        color: '#111',
        alignSelf: 'center'
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 30,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    imgBackground: {
        width: '100%',
        resizeMode: 'stretch',
        flexDirection: 'column',
        flex: 1,
        marginBottom: 10
    }, tableTitle: {
        flex: 1,
        backgroundColor: '#ae0000',
        height: 35
    }, tableTitleText: {
        fontWeight: "bold",
        fontSize: 13,
        margin: 2,
        textAlign: 'center',
        color: 'white',
    }, text: {
        textAlign: 'center',
        margin: 1,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    }
});