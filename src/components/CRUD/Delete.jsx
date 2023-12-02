import React from "react";
import { View, Text, Button } from "react-native";

export default function Delete({ user, onDelete, onCancel }) {
  const handleDelete = () => {
    onDelete(user.id);
  };

  return (
    <View>
      <Text>¿Seguro que quieres borrar a {user.first || user.firstname}?</Text>
      <Button title="Sí, Borrar" onPress={handleDelete} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
}
