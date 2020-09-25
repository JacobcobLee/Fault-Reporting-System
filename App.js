import * as React from 'react';
import {
  Platform, StyleSheet, View, Text,
  Image, TouchableOpacity, Alert, Button, TextInput
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import MainStackNavigator from './MainStackNavigator';

console.disableYellowBox = true; //Hide yellow warnings in expo app

const Stack = createStackNavigator();

//Initialize firebase..
//firebase.initializeApp(ApiKeys.firebaseConfig);
export default class App extends React.Component {
  render() {
    //getData();
    return (
      <MainStackNavigator/>
    );
  }
}
const styles = StyleSheet.create(
  {
    MainContainer:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0  
    },

    SplashScreen_RootView:
    {
      justifyContent: 'center',
      flex: 1,
      margin: 10,
      position: 'absolute',
      width: '100%',
      height: '100%',
    },

    SplashScreen_ChildView:
    {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      flex: 1,
    },
  });