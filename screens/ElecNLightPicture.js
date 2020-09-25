import React, { Component } from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

// Set the key-value pairs for the different languages you want to support.

export default class DisplayPicture extends Component {

    state = {
    }
    componentDidMount() {

    }

    render() {
        return (
            <ScrollView>
                <View>
                    <View>
                        <Text style={styles.text}>T5/T8 Light tube/长灯管</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/T5_T8_LightTube.jpg')} />
                </View>
                <View>
                    <View>
                        <Text style={styles.text}>LED strip LED/灯条</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/Led_Strip.jpg')} />
                </View>
                <View>
                    <View>
                        <Text style={styles.text}>Crystal Pendant Light/水晶灯</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/Crystal_Pendant_Light.jpg')} />
                </View>
                <View>
                    <View>
                        <Text style={styles.text}>LED Round Panel LED/圆灯</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/LED_Round_Panel_LED.jpg')} />
                </View>
                <View>
                    <View>
                        <Text style={styles.text}>Arianetech LED Glow Tube/肉干架LED灯</Text>
                    </View>
                    <Image style={styles.imgBackground} source={require('../images/Arianetech_LED_Glow_Tube.jpg')} />
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