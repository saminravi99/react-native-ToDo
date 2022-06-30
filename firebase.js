// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-X5yaiYlAux8wqCqaw6ivhUb5azuuLrc",
  authDomain: "todo-app-rn-saminravi99.firebaseapp.com",
  projectId: "todo-app-rn-saminravi99",
  storageBucket: "todo-app-rn-saminravi99.appspot.com",
  messagingSenderId: "449554353447",
  appId: "1:449554353447:web:671a4cd0db0dcdddfa2d02",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };