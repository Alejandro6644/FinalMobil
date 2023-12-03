import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";

export default function DeleteUser({ user, onDelete, onCancel }) {
  const handleDelete = () => {
    onDelete(user.id);
    alert("Videojuego eliminado con éxito!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Seguro que quieres borrar a {user.name}?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleDelete} 
      >
        <Text style={styles.buttonText}>Sí, Borrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onCancel} 
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    backgroundColor: "rgba(91, 192, 222, 0.85)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: "50%",
    borderRadius: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#3E92CC",
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
});
