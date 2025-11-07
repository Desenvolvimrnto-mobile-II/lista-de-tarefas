import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Tasks, Task } from '@/src/lib/api';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const taskId = Number(id);

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<Task['status']>('A Fazer');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await Tasks.get(taskId);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setStatus((data.status as any) || 'A Fazer');
    } catch (e: any) {
      console.error(e?.message);
      Alert.alert('Erro', 'Não foi possível carregar a tarefa.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [taskId, router]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async () => {
    if (!task) return;
    const next = task.status === 'Concluída' ? 'A Fazer' : 'Concluída';
    try {
      const updated = await Tasks.update(task.id, { status: next });
      setTask(updated);
      setStatus(updated.status as any);
    } catch (e: any) {
      console.error(e?.message);
      Alert.alert('Erro', 'Não foi possível alterar o status.');
    }
  };

  const save = async () => {
    if (!title.trim()) return Alert.alert('Validação', 'Título é obrigatório.');
    try {
      await Tasks.update(taskId, { title: title.trim(), description: description.trim() || undefined, status });
      Alert.alert('Sucesso', 'Tarefa atualizada.');
      router.back();
    } catch (e: any) {
      console.error(e?.message);
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  const remove = async () => {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await Tasks.remove(taskId);
            router.back();
          } catch (e: any) {
            console.error(e?.message);
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!task) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Título da tarefa"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        placeholder="Descrição"
        multiline
      />

      <Text style={styles.label}>Status: <Text style={status === 'Concluída' ? styles.done : styles.pending}>{status}</Text></Text>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <TouchableOpacity onPress={toggleStatus} style={[styles.button, { backgroundColor: '#111827' }]}>
          <Text style={styles.buttonText}>{status === 'Concluída' ? 'Marcar A Fazer' : 'Marcar Concluída'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={remove} style={[styles.button, { backgroundColor: '#dc2626' }]}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={save} style={[styles.button, { backgroundColor: '#2563eb', marginTop: 16 }]}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12 },
  input: { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6 },
  button: { padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flex: 1 },
  buttonText: { color: '#fff', fontWeight: '700' },
  done: { color: 'green', fontWeight: 'bold' },
  pending: { color: 'orange', fontWeight: 'bold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }
});
