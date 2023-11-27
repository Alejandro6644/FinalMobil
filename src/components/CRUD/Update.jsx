import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import FooterShared from "../shared/Footer-shared";

export default function Update (props) {
  const { navigation } = props;
    return (
        <View style={styles.container}>
        <View style={styles.body}>
          <Text> No voten por Claudia </Text>
        </View>
        <FooterShared style={styles.footer} navigation={navigation}></FooterShared>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    height: "100%",
  },
  body: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
