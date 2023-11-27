import { View, TextInput, StyleSheet, Text, Button } from "react-native";
import React, { useState, useEffect } from "react";

import { Picker } from "@react-native-picker/picker";

export default function Form(props) {
  const {capital, total, interes,meses, setCapital, setInteres, setMeses, calculate } = props;
  const [selectedMonths, setSelectedMonths] = useState();

  useEffect(() => {
    calculate();
  }, []);
  return (
    <View>
      <TextInput
        keyboardType="phone-pad"
        style={styles.input}
        placeholder="cantidad a pedir"
        onChange={(e) => setCapital(e.nativeEvent.text)}
      />
      <View>
        <TextInput
          keyboardType="phone-pad"
          style={[styles.input, styles.segundo]}
          placeholder="cantidad a pedir 2"
          onChange={(e) => setInteres(e.nativeEvent.text)}
        />
      </View>
      <View>
        <Picker
          selectedValue={selectedMonths}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedMonths(itemValue);
            setMeses(itemValue);
            calculate();
          }}
          style={styles.picker}
        >
          <Picker.Item label="3 meses" value={3} />
          <Picker.Item label="6 meses" value={6} />
          <Picker.Item label="9 meses" value={9} />
          <Picker.Item label="12 meses" value={12} />
          <Picker.Item label="24 meses" value={24} />
        </Picker>
        <View>
          <Text>Seleccionado xd: {selectedMonths}</Text>
          <Text>Hola xd asd </Text>
        </View>
      </View>
      {/* <Button title="Enviar" onPress={onsubmit} /> */}
    </View>
  );
}

export function Form2() {
  return (
    <View>
      <TextInput
        style={[styles.input, styles.segundo]}
        placeholder="Formulario 2 "
      />
    </View>
  );
}

export function Form3() {
  const [selectedMonths2, setSelectedMonths2] = useState();

  return (
    <View>
      <Picker
        selectedValue={selectedMonths2}
        onValueChange={(itemValue, itemIndex) => setSelectedMonths2(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="3 meses" value={3} />
        <Picker.Item label="6 meses" value={6} />
        <Picker.Item label="9 meses" value={9} />
        <Picker.Item label="12 meses" value={12} />
        <Picker.Item label="24 meses" value={24} />
      </Picker>
      <View>
        <Text>Seleccionado xd: {selectedMonths2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Estilos para el contenedor que rodea al TextInput
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    // Estilos para el TextInput en sí
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
  },

  segundo: {
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    height: 40,
    backgroundColor: "white", // Cambia el color de fondo del Picker
    marginBottom: 10, // Espacio inferior entre el Picker y el texto
    color: "red",
    fontSize: 40,
  },
  inputPercentage: {
    width: "40%",
    marginLeft: 5,
  },
});
