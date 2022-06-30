import React, { useEffect, useReducer, useState } from "react";
// import * as firebase from 'firebase';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import * as Facebook from "expo-facebook";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "user":
      return {
        ...state,
        user: action.user,
      };
    case "loading":
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      break;
  }
  return state;
};

async function loginWithFacebook() {
  let options = null;
  if (Platform.OS === "android") {
    options = "359386909638492";
  } else {
    options = {
      appId: "359386909638492",
      version: "v9.0",
      appName: "ToDo App - Test1",
    };
  }
  try {
    await Facebook.initializeAsync({
      appId: "359386909638492",
      version: "v9.0",
      appName: "ToDo App - Test1",
    });
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile"],
    });
    if (type === "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch((error) => {
          // Handle Errors here.
        });
    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}

const initialState = {
  user: null,
  isLoading: true,
};

export default function LoginScreen(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (email === "" || password === "") {
      alert("Please enter email and password");
    } else {
      props.navigation.navigate("ToDoList", {
        user: state.user,
      });
      setPassword("");
      setEmail("");
    }
  };

  const handleLogin = () => {
    if (email === "" || password === "") {
      alert("Please enter email and password");
    } else {
      props.navigation.navigate("ToDoList", {
        user: state.user,
      });
      setPassword("");
      setEmail("");
    }
  };

  async function signOutUser() {
    try {
      await firebase.auth().signOut();
      dispatch({ type: "user", user: null });
    } catch (error) {
      console.log("Error Signing Out: " + error);
    }
  }

  function loginCheck() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: "user", user: user });
        dispatch({ type: "loading", isLoading: false });
        props.navigation.navigate("ToDoList", {
          user: user,
          signOutUser: () => signOutUser(),
        });
      } else {
        dispatch({ type: "loading", isLoading: false });
      }
    });
  }

  useEffect(() => {
    loginCheck();
    return () => {
      loginCheck();
    };
  }, []);

  return (
    <LinearGradient
      colors={["rgb(89, 74, 225)", "rgb(131, 52, 210)"]}
      start={[0.6, 0]}
      style={{ height: "100%" }}
    >
      <StatusBar translucent barStyle="light-content"></StatusBar>
      {state.isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
      {!state.isLoading && (
        <View style={[styles.centered, styles.container]}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>
              <Ionicons name="ios-checkmark-circle" size={60} color="#fff" />{" "}
              Todo List
            </Text>
          </View>
          <View style={[styles.centered, { flex: 1 }]}>
            {!state.user ? (
              <React.Fragment>
                <KeyboardAvoidingView
                  style={styles.container}
                  behavior="padding"
                >
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Email"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Password"
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      style={styles.input}
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={handleLogin}
                      style={[styles.button, styles.buttonLeft]}
                    >
                      <Text style={[styles.buttonText]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSignUp}
                      style={[
                        styles.button,
                        styles.buttonOutline,
                        styles.buttonRight,
                      ]}
                    >
                      <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[styles.loginButton, { marginBottom: 25 }]}
                    onPress={() => loginWithFacebook()}
                  >
                    <Ionicons
                      name="logo-facebook"
                      size={22}
                      color="#fff"
                      style={{ left: -3, top: 1 }}
                    />
                    <Text style={styles.loginButtonText}>
                      Login with Facebook
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("ToDoList", {
                        user: state.user,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.loginButtonText,
                        { fontSize: 13.5, left: -1, opacity: 0.95 },
                      ]}
                    >
                      Continue without logging in
                    </Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    { marginBottom: 25, backgroundColor: "orange" },
                  ]}
                  onPress={() => signOutUser()}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={22}
                    color="#fff"
                    style={{ left: -3, top: 1 }}
                  />
                  <Text style={styles.loginButtonText}>
                    Sign Out of Todo List
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("ToDoList", { user: state.user })
                  }
                >
                  <Text
                    style={[
                      styles.loginButtonText,
                      { fontSize: 13.5, left: -1, opacity: 0.95 },
                    ]}
                  >
                    Back to Todo List
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            )}
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    justifyContent: "center",
    height: "40%",
  },
  header: {
    color: "#fff",
    fontSize: 55,
    fontWeight: "600",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#1877f2",
    padding: 7,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.17,
    shadowRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    right: -6,
  },
  footer: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "400",
    fontSize: 11,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 100,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "45%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonLeft: {
    marginRight: "2%",
  },
  buttonRight: {
    marginLeft: "2%",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
