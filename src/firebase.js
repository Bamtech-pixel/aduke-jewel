import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBJtPC8EwP-qGGTOkcAQT_-leG2MeEOOY",
  authDomain: "bamtech-76544.firebaseapp.com",
  projectId: "bamtech-76544",
  storageBucket: "bamtech-76544.firebasestorage.app",
  messagingSenderId: "592867623278",
  appId: "1:592867623278:web:0fe2dde616b1768b88417f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
