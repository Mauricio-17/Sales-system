//@ts-check
import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyACvkJWZ0-7HUjLQuSgC4tSWCxKB1MAPXw",
    authDomain: "heladeria-venta.firebaseapp.com",
    projectId: "heladeria-venta",
    storageBucket: "heladeria-venta.appspot.com",
    messagingSenderId: "375141492708",
    appId: "1:375141492708:web:09593ee087ba36749589f1"
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

export {firebase, db}
