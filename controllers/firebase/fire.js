// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7yvO4KxI7pKR17sVzhFHMZa6zWEBjsjw",
  authDomain: "experience-upload.firebaseapp.com",
  projectId: "experience-upload",
  storageBucket: "experience-upload.appspot.com",
  messagingSenderId: "299127340507",
  appId: "1:299127340507:web:4385dbb4358aa89d2bfbfe",
  measurementId: "G-F393BEPDMP",
  storageBucket:''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);