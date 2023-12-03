import React, { useState } from "react";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../utils/conn";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
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
  const [gameData, setGameData] = useState({
    name: "",
    gender: "",
    release_date: "",
    img_url: null,
  });

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

  const uploadImageAndGameData = async (imageUri) => {
    try {
      // Extrae la extensión del archivo del URI de la imagen
      const imageExtension = imageUri.split('.').pop();
      const imageName = `${Date.now().toString()}.${imageExtension}`; // Añade la extensión al nombre del archivo
  
      const reference = ref(storage, `images/${imageName}`);
  
      // Aquí debes convertir imageUri a Blob si es necesario antes de subirlo
      // Crea un objeto Blob si estás trabajando con un URI de archivo
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      // Sube el Blob en lugar del URI directamente
      await uploadBytes(reference, blob);
  
      // Obtiene la URL de la imagen recién cargada
      const imageUrl = await getDownloadURL(reference);
  
      // Actualiza el estado gameData con la URL de la imagen
      setGameData((prevData) => ({
        ...prevData,
        img_url: imageUrl,
      }));
  
      console.log("Imagen cargada exitosamente.");
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
    }
  };
  

  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Se requiere permiso para acceder a la galería de fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        await uploadImageAndGameData(result.uri);
        console.log("Éxito al subir la imagen");
      }
    } catch (error) {
      console.error("Error al seleccionar y subir la imagen: ", error);
    }
  };

  const handleCameraPicker = async () => {
    try {
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
        await uploadImageAndGameData(result.uri);
        console.log("Éxito al subir la imagen");
      }
    } catch (error) {
      console.error("Error al tomar y subir la foto: ", error);
    }
  };

  const handleGuardarPersona = async () => {
    if (!nombre || !apellido || !fechaNacimiento || !gameData.img_url) {
      alert("Todos los campos son obligatorios, incluida la imagen");
      return;
    }
    const db = getFirestore(app);
    try {
      const docRef = await addDoc(collection(db, "videogames"), {
        name: nombre,
        gender: apellido,
        release_date: fechaNacimiento,
        img_url: gameData.img_url, // Utiliza la URL de la imagen del estado gameData
      });
      console.log("Documento escrito con ID: ", docRef.id);
      // Limpia los campos después de guardar
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
      setGameData({
        name: "",
        gender: "",
        release_date: "",
        img_url: null,
      }); // Limpia los datos del juego después de guardar
      alert("Videojuego creado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento: ", error);
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

      {gameData.img_url && (
        <View>
          <Image
            source={{ uri: gameData.img_url }}
            style={{ width: 200, height: 200 }}
          />
          <Button title="Ver imagen" onPress={showImagePreview} />
        </View>
      )}

      <Button title="Guardar Videojuego" onPress={handleGuardarPersona} />

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
          <Image
            source={{ uri: gameData.img_url }}
            style={{ width: 300, height: 300 }}
          />
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
