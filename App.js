import React from 'react';
// import firebase from 'react-native-firebase';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import * as firebase from 'firebase';
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import firebase from "firebase/compat/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";

import LoginScreen from './Components/LoginScreen';
import ToDoList from './Components/TodoList';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';


export const firebaseConfig = {
  apiKey: "AIzaSyB-X5yaiYlAux8wqCqaw6ivhUb5azuuLrc",
  authDomain: "todo-app-rn-saminravi99.firebaseapp.com",
  projectId: "todo-app-rn-saminravi99",
  storageBucket: "todo-app-rn-saminravi99.appspot.com",
  messagingSenderId: "449554353447",
  appId: "1:449554353447:web:671a4cd0db0dcdddfa2d02",
};

firebase.initializeApp(firebaseConfig);


firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
        console.log('We are authenticated now!');
    }
    // Do other things
});

const MainNavigator = createStackNavigator(
    {
        LoginScreen: LoginScreen,
        ToDoList: ToDoList,
    },
    {
        initialRouteName: 'LoginScreen',
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

const AppContainer = createAppContainer(MainNavigator)

export default function App() {
    return (
            <AppContainer />
    )
}  