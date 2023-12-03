import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, Image, Button, Modal } from "react-native";
import FooterShared from "../shared/Footer-shared";
import FormData from "./FormData";
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "../../utils/conn";
import defaultProfileImage from "../../assets/aqua.jpg";
import EditUser from "./Edit";
import DeleteUser from "./Delete";

export default function Create(props) {
  const { navigation } = props;
  const [users, setUsers] = useState([]);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const db = getFirestore(app);
    const usersCol = collection(db, "videogames");
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
        console.error(error);
      }
    );

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
    const db = getFirestore(app);
    const userDoc = doc(db, "videogames", editedUser.id);
    await updateDoc(userDoc, editedUser);
    setEditUserModalVisible(false);
  };

  const handleDeleteUserConfirmed = async (userId) => {
    const db = getFirestore(app);
    const userDoc = doc(db, "videogames", userId);
    await deleteDoc(userDoc);
    setDeleteUserModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.body}>
        {users.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <Image
              source={user.img ? { uri: user.img } : defaultProfileImage}
              style={styles.userImage}
            />
            <Text>Nombre: {user.name }</Text>
            <Text>Genero del videojuego: {user.gender }</Text>
            <Text>Fecha de publicación: {user.realse_date}</Text>
            <Button
              title="Editar"
              onPress={() => handleEditUser(user)}
            />
            <Button
              title="Borrar"
              onPress={() => handleDeleteUser(user)}
            />
          </View>
        ))}

        {/* Modal flotante de edición */}
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

        {/* Modal flotante de eliminación */}
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
    borderRadius: 50,
    marginBottom: 10,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semi-transparente para el modal
  },
});
