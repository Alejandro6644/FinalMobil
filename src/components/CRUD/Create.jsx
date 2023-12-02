import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Button,
} from "react-native";
import FooterShared from "../shared/Footer-shared";
import FormData from "./FormData";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../utils/conn";
import defaultProfileImage from "../../assets/aqua.jpg";
import Edit from "./Edit";
import Delete from "./Delete";

export default function Create(props) {
  const { navigation } = props;
  const [users, setUsers] = useState([]);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserModalVisible(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteUserModalVisible(true);
  };

  const handleSaveUser = async (editedUser) => {
    // Actualizar los datos del usuario en Firebase
    const db = getFirestore(app);
    const userDoc = doc(db, "user", editedUser.id);
    await updateDoc(userDoc, editedUser);

    // Cerrar el modal de edición
    setEditUserModalVisible(false);
  };

  const handleDeleteUserConfirmed = async (userId) => {
    // Borrar al usuario de Firebase
    const db = getFirestore(app);
    const userDoc = doc(db, "user", userId);
    await deleteDoc(userDoc);

    // Cerrar el modal de eliminación
    setDeleteUserModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.body}>
        {/* Iterar y mostrar usuarios */}
        {users.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <Image
              source={user.img ? { uri: user.img } : defaultProfileImage}
              style={styles.userImage}
            />
            <Text>Nombre: {user.first || user.firstname}</Text>
            <Text>Apellido: {user.last || user.lastname}</Text>
            <Text>Fecha de Nacimiento: {user.born}</Text>
            <Button
              title="Editar"
              onPress={() => navigation.navigate("Edit")}
            ></Button>
            <Button
              title="Borrar"
              onPress={() => navigation.navigate("Delete")}
            ></Button>
          </View>
        ))}
        {/* Modales de edición y eliminación */}
        <Modal
          visible={editUserModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <EditUser
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={() => setEditUserModalVisible(false)}
            />
          </View>
        </Modal>

        <Modal
          visible={deleteUserModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <DeleteUser
              user={selectedUser}
              onDelete={handleDeleteUserConfirmed}
              onCancel={() => setDeleteUserModalVisible(false)}
            />
          </View>
        </Modal>
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
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Hace que la imagen sea circular
    marginBottom: 10,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
