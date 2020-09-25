import Firebase from 'firebase';

let firebaseConfig = {
    apiKey: "AIzaSyAJFwAwNQ-I7zrAwxRKdaUsPprBOWP7Ov8",
    authDomain: "bch-fr.firebaseapp.com",
    databaseURL: "https://bch-fr.firebaseio.com/",
    projectId: "bch-fr",
    storageBucket: "bch-fr.appspot.com",
    messagingSenderId: "12338062208",
    appId: "1:12338062208:web:65b0d01fc9fae9f900d765",
    measurementId: "G-V9LNMCLE8K"
};
let app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();
export const st = app.storage();
