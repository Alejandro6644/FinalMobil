import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import app from "./src/utils/conn";
import Auth from "./src/components/Auth";

import React, { useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";

import Footer from "./src/components/Footer";
import Result from "./src/components/Result";
import Form, { Form2, Form3 } from "./src/components/Form";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  collection,
  addDo,
} from "firebase/auth";
import People from "./src/components/People";
import Navigator from "./src/navigator/Navigator";

const STYLES = ["default", "dark-content", "light-content"];
const TRANSITIONS = ["fade", "slide", "none"];

const auth = getAuth(app);
export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, [user]);

  if (user) {
    return <Navigator></Navigator>;
  } else {
    return (
      <View style={styles.container}>
        <Auth />
      </View>
    );
  }
}

function Logout(params) {
  const logout = () => {
    signOut(auth)
      .then(() => {
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const [hidden, setHidden] = useState(false);
  const [capital, setCapital] = useState(null);
  const [interes, setInteres] = useState(null);
  const [meses, setMeses] = useState(3);
  const [total, setTotal] = useState({ monthlyFee: 0, totalPayable: 0 });
  const [errorMessage, setErrorMessage] = useState("");

  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0]
  );

  useEffect(() => {
    calculate();
  }, [capital, meses, interes]);

  const setValue = () => {};

  const changeStatusBarVisibility = () => setHidden(!hidden);

  const changeStatusBarStyle = () => {
    const styleId = STYLES.indexOf(statusBarStyle) + 1;
    if (styleId === STYLES.length) {
      setStatusBarStyle(STYLES[0]);
    } else {
      setStatusBarStyle(STYLES[styleId]);
    }
  };

  const calculate = () => {
    setErrorMessage("");
    setTotal(null);
    if (!capital) {
      setErrorMessage("Ingrese el capital");
    } else if (!interes) {
      setErrorMessage("Ingrese el interés");
    } else if (!meses) {
      setErrorMessage("Ingrese los meses");
    } else {
      const i = interes / 100;
      const fee = (capital * i) / (1 - Math.pow(1 + i, -meses));
      const totalPayable = fee * meses;
      setTotal({
        monthlyFee: fee.toFixed(2),
        totalPayable: totalPayable.toFixed(2),
      });
    }
  };
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden}
      />

      <View style={styles.head}>
        <Text style={styles.text}>Head</Text>
        <Text style={styles.textStyle}>
          StatusBar Visibility: {hidden ? "Hidden" : "Visible"}
        </Text>
        <Text style={styles.textStyle}>StatusBar Style: {statusBarStyle}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.formContainer}>
          <Form
            capital={capital}
            total={total}
            interes={interes}
            meses={meses}
            setCapital={setCapital}
            setInteres={setInteres}
            setMeses={setMeses}
            calculate={calculate}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            title="Toggle StatusBar"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="Change StatusBar Style"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === "ios" ? (
            <Button
              title="Change StatusBar Transition"
              onPress={changeStatusBarTransition}
            />
          ) : null}
        </View>
      </View>
      <Result
        capital={capital}
        total={total}
        interes={interes}
        meses={meses}
        errorMessage={errorMessage}
      />
      <Footer calculate={calculate} logout={logout}></Footer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 40,
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: "center",
    marginBottom: 8,
  },
  head: {
    backgroundColor: colors.PRYMARY_COLOR,
    height: 200,
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formContainer: {
    flex: 1,
    margin: 10,
  },
});
