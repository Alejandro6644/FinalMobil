import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes 
} from "firebase/storage";
import { app } from "../../utils/conn";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions"; // Importa Permissions para la cámara
import FooterShared from "../shared/Footer-shared";

const storage = getStorage(app);

export default function FormData(props) {
  const { navigation } = props;
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [imgURL, setImgURL] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showImagePreview = () => {
    setImagePreviewVisible(true);
  };

  const hideImagePreview = () => {
    setImagePreviewVisible(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFechaNacimiento(formattedDate);
    hideDatePicker();
  };
  const handleImagePicker = async () => {
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requiere permiso para acceder a la galería de fotos.');
        return;
      }
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) { 
      try {
        const imageRef = ref(storage, 'images/' + result.assets[0].fileName); 
        const response = await fetch(result.assets[0].uri); 
        const blob = await response.blob(); 
        await uploadBytes(imageRef, blob); 
        const imgUrl = await getDownloadURL(imageRef);
  
        setImgURL(imgUrl); 
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  const handleCameraPicker = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      alert("Se requiere permiso para acceder a la cámara.");
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
      const docRef = await addDoc(collection(db, "videogames"), {
        name: nombre,
        gender: apellido,
        realse_date: fechaNacimiento,
        img: imgURL, // Guarda la URL de descarga de la imagen en el campo "img"
      });
      console.log("Document written with ID: ", docRef.id);
      // Limpia los campos después de guardar
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
      setImgURL(null); // Limpia la URL de descarga de la imagen después de guardar
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nombre del juego"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <TextInput
        placeholder="Género del videojuego"
        value={apellido}
        onChangeText={(text) => setApellido(text)}
      />
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          placeholder="Fecha de lanzamiento"
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

      {imgURL && (
        <View>
          <Image source={{ uri: imgURL }} style={{ width: 200, height: 200 }} />
          <Button title="Ver imagen" onPress={showImagePreview} />
        </View>
      )}

      <Button title="Guardar Persona" onPress={handleGuardarPersona} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <FooterShared style={styles.footer} navigation={navigation} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={imagePreviewVisible}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: imgURL }} style={{ width: 300, height: 300 }} />
          <Pressable onPress={hideImagePreview}>
            <Text style={{ color: "white" }}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    height: "100%",
  },
  // Resto de los estilos...
});
