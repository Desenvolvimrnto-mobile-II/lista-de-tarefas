import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Tasks } from '@/src/lib/api';

export default function NewTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const save = async () => {
    if (!title.trim()) return Alert.alert('Validação', 'Título é obrigatório.');
    try {
      // user_id fixo=1 para demo
      await Tasks.create({ user_id: 1, title: title.trim(), description: description.trim() || undefined });
      router.back(); // volta para a lista
    } catch (e: any) {
      console.error(e?.message);
      Alert.alert('Erro', 'Não foi possível criar a tarefa.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Estudar Express"
          style={styles.input}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="CRUDzinho"
          multiline
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        />

        <TouchableOpacity onPress={save} style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12 },
  input: { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
