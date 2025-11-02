// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "your_apiKey",
  authDomain: "remembread.firebaseapp.com",
  projectId: "remembread",
  storageBucket: "remembread.firebasestorage.app",
  messagingSenderId: "365476883445",
  appId: "1:365476883445:web:093ac60eca9d09a5184ebc",
  measurementId: "G-FJKCEGY2QJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };
