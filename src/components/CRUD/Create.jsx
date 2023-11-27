import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import FooterShared from "../shared/Footer-shared";
import FormData from "./FormData";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../utils/conn";

export default function Create(props) {
  const { navigation } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const db = getFirestore(app);
    const usersCol = collection(db, "user");
    // onSnapshot se suscribe a los cambios de la colección
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      },
      (error) => {
        // Manejar cualquier error
        console.error(error);
      }
    );

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.body}>
        {/* Iterar y mostrar usuarios */}
        {users.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Text>Nombre: {user.first || user.firstname}</Text>
            <Text>Apellido: {user.last || user.lastname}</Text>
            <Text>Fecha de Nacimiento: {user.born}</Text>
          </View>
        ))}
      </ScrollView>
      <FooterShared style={styles.footer} navigation={navigation} />
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
    width: "100%",
  },
  userItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    // Añade estilos adicionales si lo necesitas
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
