import React, { useState } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../utils/conn";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function People(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; 
    setFechaNacimiento(formattedDate); // Actualiza el estado de fechaNacimiento
    hideDatePicker();
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
      });
      console.log("Document written with ID: ", docRef.id);
      // Limpia los campos después de guardar
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
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
          editable={false} // hace que el TextInput no sea editable
          // No necesitas onChangeText aquí ya que el valor se establecerá con el DatePicker
        />
      </TouchableOpacity>

      {/* El resto del código UI sigue igual */}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      
      {/* El resto del código UI sigue igual */}
      <Button title="Guardar Persona" onPress={handleGuardarPersona} />

    </View>
  );
}
