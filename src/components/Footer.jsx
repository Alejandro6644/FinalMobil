import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../utils/color";

export default function Footer(props) {
  const { setCapital, setInteres, setMeses, calculate, logout } = props;

  return (
    <View style={styles.viewFooter}>
      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={styles.Texto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#61dafb",
    height: 80,
    justifyContent: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  Texto: {
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 3.5,
    color: "red",
    textAlign: "center",
  },
  btn:{
    backgroundColor: colors.SECONDARY_COLOR,
    padding: 14,
    borderRadius: 20,
    textAlign: "center",
    color: 'white',
    width: '75%',
  }
});
