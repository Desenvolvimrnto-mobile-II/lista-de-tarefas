import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { TaskAPI } from '../api';

export default function TaskFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const save = async () => {
    if (!title.trim()) {
      return Alert.alert('Validação', 'Título é obrigatório');
    }
    try {
      // user_id 1 só para demo; depois você pode autenticar e usar o id real
      await TaskAPI.create({ user_id: 1, title, description });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Título</Text>
      <TextInput
        placeholder="Estudar Express"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 }}
      />

      <Text style={{ fontSize: 16, fontWeight: '600' }}>Descrição</Text>
      <TextInput
        placeholder="CRUDzinho"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, height: 100, textAlignVertical: 'top' }}
      />

      <TouchableOpacity onPress={save}
        style={{ backgroundColor: '#2563eb', padding: 14, borderRadius: 10, marginTop: 16 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
