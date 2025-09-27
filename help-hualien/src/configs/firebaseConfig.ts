// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6tEUKOT7p-rUUj1uedzdOpNn3ui5f3iE",
    authDomain: "help-hualien-gps.firebaseapp.com",
    projectId: "help-hualien-gps",
    storageBucket: "help-hualien-gps.firebasestorage.app",
    messagingSenderId: "1088713903727",
    appId: "1:1088713903727:web:348c8aa02ed039f124879a",
    measurementId: "G-GDM9V8QW9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;