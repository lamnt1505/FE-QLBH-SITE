import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCC4_5CItunwdlQF7fzLO_Ftx2hVfAAEak",
  authDomain: "htkt-33179.firebaseapp.com",
  databaseURL: "https://htkt-33179-default-rtdb.firebaseio.com",
  projectId: "htkt-33179",
  storageBucket: "htkt-33179.firebasestorage.app",
  messagingSenderId: "580315399018",
  appId: "1:580315399018:web:92c7501f676b7dfc069b13",
  measurementId: "G-YBXKDZTY8H"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
