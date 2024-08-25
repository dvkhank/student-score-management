// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbmwXSF3oOXkZkkg0xkgGE87zQiBqo8qY",
  authDomain: "api-firebase-55acd.firebaseapp.com",
  projectId: "api-firebase-55acd",
  storageBucket: "api-firebase-55acd.appspot.com",
  messagingSenderId: "1088341749319",
  appId: "1:1088341749319:web:cd2161bf260093135f8b62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { auth, firestore };
