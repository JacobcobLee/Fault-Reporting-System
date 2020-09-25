import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as Application from 'expo-application';

import Home from './screens/Home';
import Splash from './screens/Splash';
import Report from './screens/ReportScreen';
import Outlet from './screens/Outlet';
import Feedback from './screens/Feedback';
import AirconPictures from './screens/AirconPicture';
import ChillerPictures from './screens/ChillerPicture';
import ElecNLightPictures from './screens/ElecNLightPicture';


const Stack = createStackNavigator()

function MainStackNavigator() {
  let buildVersion = Application.nativeApplicationVersion;
  console.log(Application.nativeApplicationVersion)
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name='Splash' component={Splash} />
        <Stack.Screen name='Home' component={Home} options={{title: 'Scan QR/扫描二维     ' +'App Version: ' + buildVersion}}/>
        <Stack.Screen name='Report' component={Report} options={{ title: 'Report/报告' }}/>
        <Stack.Screen name='Outlet' component={Outlet} options={{ title: 'Outlet/商店' }}/>
        <Stack.Screen name='Feedback' component={Feedback} options={{ title: 'Feedback/反馈' }}/>
        <Stack.Screen name='ElecNLightPictures' component={ElecNLightPictures} options={{ title: 'Electrical & Lighting Picture/电与灯事项图片' }} />
        <Stack.Screen name='AirconPictures' component={AirconPictures} options={{ title: 'Aircon Picture/冷气图片' }} />
        <Stack.Screen name='ChillerPictures' component={ChillerPictures} options={{ title: 'Chiller Picture/冷箱图片' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator