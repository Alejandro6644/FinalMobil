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
      const imageExtension = imageUri.split(".").pop();
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
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del juego"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Género del videojuego"
        value={apellido}
        onChangeText={(text) => setApellido(text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          placeholder="Fecha de lanzamiento"
          value={fechaNacimiento}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.perro} onPress={handleImagePicker}>
        <Text style={styles.white}>Seleccionar imagen de la galería</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.perro} onPress={handleCameraPicker}>
        <Text style={styles.white}>Tomar foto con la cámara</Text>
      </TouchableOpacity>

      {gameData.img_url && (
        <View style={styles.imgcontainer}>
          <Image
            source={{ uri: gameData.img_url }}
            style={{ width: 200, height: 200 }}
          />
          <TouchableOpacity style={styles.button} onPress={showImagePreview}>
            <Text style={styles.buttonText}>Ver imagen</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGuardarPersona}>
        <Text style={styles.buttonText}>Guardar Videojuego</Text>
      </TouchableOpacity>

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
          <Image source={{ uri: gameData.img_url }} style={styles.imgpreview} />
          <Pressable onPress={hideImagePreview} style={styles.press} >
            <Text style={styles.buttonPress}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,

  },
  imgcontainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  imgpreview: {
    width: 350,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 6,
  },
  white: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 6,
    color: "white",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    marginTop: 25,
    marginLeft: 15,
    borderRadius: 5,
    width: "90%",
    fontFamily: "Roboto",
  },
  perro: {
    paddingHorizontal: "3%",
    paddingVertical: 3,
    marginVertical: 10,
    marginRight: 60,
    backgroundColor: "#3E92CC",
    color: "white",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#3E92CC",
    paddingVertical: 7,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 70
  },
  modalContainer: {
    marginVertical: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 35,
    borderRadius: 5,
    paddingHorizontal: 23
  },
  buttonPress: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
