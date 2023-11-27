import React, { Component } from "react";
import { Text, StyleSheet, View, Button } from "react-native";

export default function FooterShared(props) {
  const { navigation } = props;
  return (
    <View style={styles.footer}>
      <Button
        title="Crear"
        onPress={() => navigation.navigate("Create")}
      ></Button>
      <Button
        title="Actualizar"
        onPress={() => navigation.navigate("Crear")}
      ></Button>
      <Button
        title="Editar"
        onPress={() => navigation.navigate("Edit")}
      ></Button>
      <Button
        title="Borrar"
        onPress={() => navigation.navigate("Delete")}
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
