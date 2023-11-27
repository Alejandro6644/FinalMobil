import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import "react-native-gesture-handler";
import Create from "../components/CRUD/Create";
import Update from "../components/CRUD/Update";
import Delete from "../components/CRUD/Delete";
import Edit from "../components/CRUD/Edit";
import FormData from "../components/CRUD/FormData";
const Stack = createStackNavigator();

export default class Navigator extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="Create"
            component={Create}
            options={{
              title: "Create XD",
            }}
          />
          <Stack.Screen
            name="Crear"
            component={FormData}
            options={{
              title: "Crear ahora si XD",
            }}
          />
          <Stack.Screen
            name="Delete"
            component={Delete}
            options={{
              title: "Delete XD",
            }}
          />
          <Stack.Screen
            name="Edit"
            component={Edit}
            options={{
              title: "Editar XD",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});
