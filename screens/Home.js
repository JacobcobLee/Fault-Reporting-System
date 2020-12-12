import React, { useState, useEffect } from 'react';
import { Dimensions, Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { db } from '../constants/ApiKeys';

/*import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: { tapToScanAgain: 'Tap to Scan Again'},
  zh: { tapToScanAgain: '点击再次扫描' },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;*/


const { width } = Dimensions.get('window');

function Home(props) {
  const { navigation } = props;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qr, setQrcode] = useState(null);
  const [qrValid, setQrValid] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    let valid = false;
    let loopThrough = false;
    let faults = [];
    db.ref('/store/').on('value', snapshot => {
      let data = snapshot.val();
      faults = Object.values(data);
    });

    let storename = '';
    faults.map((faults) => {
      if (faults.qrstring == data) {
        valid = true;
        storename = faults.name;
      }
      loopThrough = true; // set true if loop through
    });
    if (loopThrough == true) { // if loop through
      if (valid == true) {
        setScanned(true);
        alert('Welcome to ' + storename + ' outlet');
        navigation.navigate('Outlet', storename);
      } else {
        alert('Invalid qr code, please scan again/\n无效的二维码, 请再次扫描');
      }
    }
    else{ // if haven't loop through
      setScanned(false); //scan again
    }



  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (

    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom:20 //for scan again button
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}>

        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />

      </BarCodeScanner>

      {scanned && <TouchableOpacity
          style={styles.customBtnBG}
          onPress={() => setScanned(false)} 
        >
          <Text style={styles.customBtnText}>Scan Again/重新扫描</Text>
        </TouchableOpacity>
      }
    </View>
  );
}
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  customBtnText: {
    fontSize: 35,
    fontWeight: '400',
    color: "#ffffff",
    justifyContent:'center'
},

/* Here style the background of your button */
customBtnBG: {
backgroundColor: "#cc3300",
paddingHorizontal: 30,
paddingVertical: 5,
borderRadius: 15
},
  layerTop: {
    flex: 1.5,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 2,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 5
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
});
export default Home