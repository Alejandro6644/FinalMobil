import React, { useState, useEffect } from "react";
import { View, TextInput, Button, TouchableOpacity, Text, Image } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../utils/conn";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'; // Importa Permissions para la cámara

export default function FormData(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [imgURL, setImgURL] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFechaNacimiento(formattedDate);
    hideDatePicker();
  };

  const handleImagePicker = async () => {
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requiere permiso para acceder a la galería de fotos.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImgURL(result.uri);
    }
  };

  const handleCameraPicker = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImgURL(result.uri);
    }
  };

  const handleGuardarPersona = async () => {
    if (!nombre || !apellido || !fechaNacimiento) {
      alert("Todos los campos son obligatorios");
      return;
    }
    const db = getFirestore(app);
    try {
      const docRef = await addDoc(collection(db, "user"), {
        first: nombre,
        last: apellido,
        born: fechaNacimiento,
        img: imgURL,
      });
      console.log("Document written with ID: ", docRef.id);
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
      setImgURL(null);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={(text) => setApellido(text)}
      />
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          placeholder="Fecha de Nacimiento"
          value={fechaNacimiento}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleImagePicker}>
        <Text>Seleccionar imagen de la galería</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCameraPicker}>
        <Text>Tomar foto con la cámara</Text>
      </TouchableOpacity>

      {imgURL && <Image source={{ uri: imgURL }} style={{ width: 200, height: 200 }} />}

      <Button title="Guardar Persona" onPress={handleGuardarPersona} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}
