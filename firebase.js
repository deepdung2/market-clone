import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZ7XwXQjQStjf-APaMHU9XrvsF_EGoYKU",
  authDomain: "carrot-market-695b4.firebaseapp.com",
  databaseURL:
    "https://carrot-market-695b4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "carrot-market-695b4",
  storageBucket: "carrot-market-695b4.appspot.com",
  messagingSenderId: "802102816635",
  appId: "1:802102816635:web:df04a52db9a11833c217de",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
