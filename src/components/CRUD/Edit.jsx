import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import FooterShared from "../shared/Footer-shared";

export default function Edit({ user, onSave, onCancel }) {
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