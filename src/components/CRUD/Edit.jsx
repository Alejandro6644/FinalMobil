import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
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
    <View>
      <Text>Editar Usuario</Text>
      <TextInput
        placeholder="Nombre"
        value={editedUser.name || ""}
        onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
      />
      <TextInput
        placeholder="Género"
        value={editedUser.gender || ""}
        onChangeText={(text) => setEditedUser({ ...editedUser, gender: text })}
      />
      <TextInput
        placeholder="Fecha de Lanzamiento"
        value={editedUser.release_date || ""}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, release_date: text })
        }
      />

      <Button
        title="Seleccionar imagen de la galería"
        onPress={handleSelectImage}
      />
      <Button title="Tomar foto con la cámara" onPress={handleTakePhoto} />
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
}
