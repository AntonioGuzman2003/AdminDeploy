import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7YjJeL3N-mRvFU1dPV48Ndppik1UJrlM",
    authDomain: "buscamv1-9c23b.firebaseapp.com",
    databaseURL: "https://buscamv1-9c23b-default-rtdb.firebaseio.com",
    projectId: "buscamv1-9c23b",
    storageBucket: "buscamv1-9c23b.appspot.com",
    messagingSenderId: "97834713505",
    appId: "1:97834713505:web:403ab16e6f24556a334be0",
    measurementId: "G-LD8GHYLK58"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const db = getDatabase(app);

export {db};

