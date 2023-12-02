import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function EditUser({ user, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <View>
      <Text>Editar Usuario</Text>
      <TextInput
        placeholder="Nombre"
        value={editedUser.first || editedUser.firstname}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, first: text })
        }
      />
      <TextInput
        placeholder="Apellido"
        value={editedUser.last || editedUser.lastname}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, last: text })
        }
      />
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
}
