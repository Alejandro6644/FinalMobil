import React, { Component } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  collection,
  addDo,
} from "firebase/auth";
import app from "../../utils/conn";
const auth = getAuth(app);

export default function FooterShared(props) {
  const { navigation } = props;

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
      <Button
        title="Listar "
        onPress={() => navigation.navigate("Create")}
      ></Button>
      <Button
        title="Crear xd"
        onPress={() => navigation.navigate("Crear")}
      ></Button>
      <Button
        title="Logout"
        onPress={logout}
      ></Button>
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
