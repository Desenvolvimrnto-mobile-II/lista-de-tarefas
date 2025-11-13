import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Tasks } from '@/src/lib/api';

export default function NewTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const save = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      Alert.alert('Validação', 'Título é obrigatório.');
      return;
    }

    // monta o payload respeitando o tipo do Tasks.create
    const payload: { user_id: number; title: string; description?: string } = {
      user_id: 1, // fixo para demo
      title: trimmedTitle,
    };

    if (trimmedDescription) {
      payload.description = trimmedDescription;
    }

    try {
      console.log('🔹 Enviando payload para criação:', payload);

      const created = await Tasks.create(payload);

      console.log('✅ Tarefa criada com sucesso:', created);

      router.back(); // volta pra lista
    } catch (e: any) {
      console.error(
        '❌ Erro ao criar tarefa:',
        e?.response?.data || e?.message || e,
      );

      const msgApi =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Não foi possível criar a tarefa.';

      Alert.alert('Erro', msgApi);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
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
  input: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
