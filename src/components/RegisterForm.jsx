import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { validateEmail } from "../utils/validations";
import { app } from "../utils/conn";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterForm(props) {
  const { changeForm } = props;
  const [formData, setFormData] = useState(initialsValue());
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    repeatPassword: false,
  });

  function initialsValue() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
    };
  }

  function changeData(type, data) {
    setFormData({ ...formData, [type]: data });
    console.log(formData);
  }

  const register = () => {
    console.log("registrando...");
    let errors = {};
    if (!formData.email || !formData.password || !formData.repeatPassword) {
      if (!formData.email) errors.email = true;
      if (!formData.password) errors.password = true;
      if (!formData.repeatPassword) errors.repeatPassword = true;
    } else if (!validateEmail(formData.email)) {
      errors.email = true;
    } else if (formData.password !== formData.repeatPassword) {
      errors.password = true;
      errors.repeatPassword = true;
    } else if (formData.password.length < 6) {
      errors.password = true;
      errors.repeatPassword = true;
    } else {
      console.log("Todo bien");
      const auth = getAuth(app);
      console.log(formData);

      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          console.log(errorMessage, errorCode);
          console.log("Error XD")
        });
    }
    console.log(errors);
    setErrors(errors);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de usuarios</Text>
      <TextInput
        style={[styles.input, errors.email ? styles.error : ""]}
        placeholder="Escribe aquí tu correo, imbecil"
        placeholderTextColor="white"
        onChange={(e) => {
          changeData("email", e.nativeEvent.text);
        }}
      />
      <TextInput
        style={[styles.input, errors.password ? styles.error : ""]}
        placeholder="Password"
        placeholderTextColor="white"
        secureTextEntry={true}
        onChange={(e) => {
          changeData("password", e.nativeEvent.text);
        }}
      />
      <TextInput
        style={[styles.input, errors.repeatPassword ? styles.error : ""]}
        placeholder="Confirm Password"
        placeholderTextColor="white"
        secureTextEntry={true}
        onChange={(e) => {
          changeData("repeatPassword", e.nativeEvent.text);
        }}
      />
      <Button title="Registrarse" onPress={register} />
      <TouchableOpacity style={styles.bottom} onPress={changeForm}>
        <Text style={styles.textos}>Iniciar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 0,
  },
  textos: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  input: {
    color: "white",
    height: 60,
    width: "80%",
    backgroundColor: "#1E3040",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    padding: 20,
    fontSize: 16,
    marginBottom: 20,
  },
  error: {
    borderColor: "blue",
    color: "red",
  },
  bottom:{
    bottom: -15,
  }
  
});
