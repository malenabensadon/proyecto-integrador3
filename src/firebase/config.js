import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBHCjgMKNN23baea5rTizdqPzfbwMSFgTw",
    authDomain: "demoprog3-a0a39.firebaseapp.com",
    projectId: "demoprog3-a0a39",
    storageBucket: "demoprog3-a0a39.appspot.com",
    messagingSenderId: "969280141367",
    appId: "1:969280141367:web:306a783f96922fc6bc27b2"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();