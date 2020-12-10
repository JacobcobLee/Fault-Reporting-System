import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyAJFwAwNQ-I7zrAwxRKdaUsPprBOWP7Ov8",
    authDomain: "bch-fr.firebaseapp.com",
    databaseURL: "https://bch-fr.firebaseio.com/",
    projectId: "bch-fr",
    storageBucket: "bch-fr.appspot.com",
    messagingSenderId: "12338062208",
    appId: "1:12338062208:web:65b0d01fc9fae9f900d765",
    measurementId: "G-V9LNMCLE8K"
};
// const config = {
//     apiKey: process.env.REACT_APP_FIREBASE_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
//   };
firebase.initializeApp(config);

export const database = firebase.database().ref('posts/');
export const db = firebase.database();
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const twitterProvider = new firebase.auth.TwitterAuthProvider();
export default firebase;
