import firebase from "firebase/app"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAJFwAwNQ-I7zrAwxRKdaUsPprBOWP7Ov8",
    authDomain: "bch-fr.firebaseapp.com",
    databaseURL: "https://bch-fr.firebaseio.com",
    projectId: "bch-fr",
    storageBucket: "bch-fr.appspot.com",
    messagingSenderId: "12338062208",
    appId: "1:12338062208:web:65b0d01fc9fae9f900d765",
    measurementId: "G-V9LNMCLE8K"
  };

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
