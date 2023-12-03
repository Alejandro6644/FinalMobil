import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../utils/conn"; // Asegúrate de que esta ruta es correcta para tu conexión de Firebase

export default function EditUser({ user, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState({ ...user });
  const storage = getStorage(app);

  const handleImageUpload = async (imageUri) => {
    const imageName = `profile_${user.id}_${Date.now()}`; // Cambia esto según tus preferencias
    const storageRef = ref(storage, `images/${imageName}`);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    try {
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setEditedUser({ ...editedUser, img_url: url });
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
      Alert.alert("Error", "No se pudo cargar la imagen. Intente de nuevo.");
    }
  };

  const handleSelectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permiso requerido",
        "Se requiere permiso para acceder a la galería de fotos."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    handleImageUpload(pickerResult.uri);
  };

  const handleTakePhoto = async () => {
    const cameraPermissionResult =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermissionResult.granted === false) {
      Alert.alert(
        "Permiso requerido",
        "Se requiere permiso para acceder a la cámara."
      );
      return;
    }

    const cameraResult = await ImagePicker.launchCameraAsync();
    if (cameraResult.cancelled === true) {
      return;
    }

    handleImageUpload(cameraResult.uri);
  };

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={editedUser.name || ""}
        onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Género"
        value={editedUser.gender || ""}
        onChangeText={(text) => setEditedUser({ ...editedUser, gender: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Lanzamiento"
        value={editedUser.release_date || ""}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, release_date: text })
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSelectImage}
      >
        <Text style={styles.buttonText}>Seleccionar imagen de la galería</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleTakePhoto}
      >
        <Text style={styles.buttonText}>Tomar foto con la cámara</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Guardar</Text>
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
    flex: 0.8,
    backgroundColor: "rgba(91, 192, 222, 0.85)",
    padding: 20,
    height: "90%",
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
    marginBottom: 20,
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
