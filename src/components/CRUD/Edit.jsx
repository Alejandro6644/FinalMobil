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
        value={editedUser.name || editedUser.first || editedUser.firstname}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, name: text })
        }
      />
      <TextInput
        placeholder="Género"
        value={editedUser.gender || editedUser.last || editedUser.lastname}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, gender: text })
        }
      />
      <TextInput
        placeholder="Fecha de Lanzamiento"
        value={editedUser.release_date || editedUser.born}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, release_date: text })
        }
      />
      <TextInput
        placeholder="URL de la Imagen"
        value={editedUser.img || ""}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, img: text })
        }
      />
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
}
