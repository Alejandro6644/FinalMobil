import React, { Component, useState } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  collection,
  addDo,
} from "firebase/auth";
import app from "../../utils/conn";
import { TouchableOpacity } from "react-native-gesture-handler";
const auth = getAuth(app);

export default function FooterShared(props) {
  const { navigation } = props;
  const [isPressedL, setIsPressedL] = useState(false);
  const [isPressedA, setIsPressedA] = useState(false);
  const [isPressedO, setIsPressedO] = useState(false);

  const logout = () => {
    console.log("Salir...");
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada xD");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isPressedL ? "red" : "lightblue" },
        ]}
        onPress={() => {
          setIsPressedL(!isPressedL);
          setIsPressedA(false);
          setIsPressedO(false);
          navigation.navigate("Create");
          setIsPressedL(false);
          setIsPressedA(false);
          setIsPressedO(false);
        }}
      >
        <Text style={styles.buttonText}>Lista</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isPressedA ? "red" : "lightblue" },
        ]}
        onPress={() => {
          setIsPressedA(!isPressedA);
          setIsPressedL(false);
          setIsPressedO(false);
          navigation.navigate("Crear");
          setIsPressedL(false);
          setIsPressedA(false);
          setIsPressedO(false);
        }}
      >
        <Text style={styles.buttonText}>Crear</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isPressedO ? "red" : "lightblue" },
        ]}
        onPress={() => {
          setIsPressedO(!isPressedO);
          setIsPressedL(false);
          setIsPressedA(false);
          logout()
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    height: "100%",
  },
  body: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    backgroundColor: "lightblue",
    paddingVertical: '3%'
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
  },
  button: {
    paddingVetica: 25,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});
