import {
  StyleSheet,
  Text,
  View,
  Button,
  Touchable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { validateEmail } from "../utils/validations";
import { app } from "../utils/conn";

export default function Login(props) {
  const { changeForm } = props;
  const [formData, setFormData] = useState(initialsValue());
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  function initialsValue() {
    return {
      email: "",
      password: "",
    };
  }

  function changeData(type, data) {
    setFormData({ ...formData, [type]: data });
    console.log(formData);
  }

  const login = () => {
    console.log("registrando...");
    let errors = {};
    if (!formData.email || !formData.password) {
      if (!formData.email) errors.email = true;
      if (!formData.password) errors.password = true;
    } else if (!validateEmail(formData.email)) {
      errors.email = true;
    } else if (formData.password.length < 6) {
      errors.password = true;
    } else {
      console.log("Todo bien");      
      const auth = getAuth(app);
      console.log(formData);
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode);
          console.log("Error XD");
        });
    }
    console.log(errors);
    setErrors(errors);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Login</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Escribe aquí tu correo"
        placeholderTextColor="white"
        onChange={(e) => {
          changeData("email", e.nativeEvent.text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="white"
        secureTextEntry={true}
        onChange={(e) => {
          changeData("password", e.nativeEvent.text);
        }}
      />
      <Button title="Iniciar sesión" onPress={login} />
      <TouchableOpacity style={styles.bottom} onPress={changeForm}>
        <Text style={styles.textos}>Registrate</Text>
      </TouchableOpacity>
      {/* <Button title="Registrar" onPress={changeForm} /> */}
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
    margin: 10,
  },
  textos: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  input: {
    color: "white",
    height: 70,
    width: "80%",
    backgroundColor: "#1E3040",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    padding: 20,
    fontSize: 16,
    marginBottom: 30,
  },
  bottom:{
    bottom: -100,
  }
});
