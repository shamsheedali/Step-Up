// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVShlGGckMkQ4VsULxzy2EWYKeFir-bSs",
  authDomain: "stepup-c5561.firebaseapp.com",
  projectId: "stepup-c5561",
  storageBucket: "stepup-c5561.appspot.com",
  messagingSenderId: "288422507867",
  appId: "1:288422507867:web:bd1b4d0642f841abd1567e",
  measurementId: "G-0FJ3ZXT77H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication setup
export const auth = getAuth(app); // Initialize Firebase Authentication
export const googleProvider = new GoogleAuthProvider(); // Google provider

