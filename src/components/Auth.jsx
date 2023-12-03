import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import app from "../utils/conn";
import RegisterForm from "./RegisterForm";
import Login from "./Login";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const changeForm = () => {
    setIsLogin(!isLogin)
  };
  return (
    <View style={styles.viewAuth}>
      <Image style={styles.logo} source={require("../assets/ZELDATOK.png")} />
      {isLogin ? <Login changeForm={changeForm}/> : <RegisterForm changeForm={changeForm}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  viewAuth: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  logo: {
    height: 350,
    marginTop: 50,
    marginBottom: 20,
    width: "80%",
  },
});
