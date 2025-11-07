import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { TaskAPI } from '../api';

export default function TasksListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TaskAPI.list(); // pode passar ?user_id
      setTasks(Array.isArray(data) ? data : [data]);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const toggleStatus = async (t) => {
    const next = t.status === 'Concluída' ? 'A Fazer' : 'Concluída';
    try {
      await TaskAPI.update(t.id, { status: next });
      load();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  };

  const remove = async (t) => {
    Alert.alert('Excluir', `Deseja excluir "${t.title}"?`, [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          await TaskAPI.remove(t.id);
          load();
        } catch {
          Alert.alert('Erro', 'Não foi possível excluir');
        }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={{
      padding: 12, marginHorizontal: 12, marginVertical: 6,
      borderRadius: 12, borderWidth: 1, borderColor: '#ddd'
    }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
      {item.description ? <Text style={{ color: '#555', marginTop: 4 }}>{item.description}</Text> : null}
      <Text style={{ marginTop: 6, color: item.status === 'Concluída' ? 'green' : 'orange' }}>
        {item.status}
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
        <TouchableOpacity onPress={() => toggleStatus(item)}>
          <Text style={{ color: '#2563eb' }}>
            {item.status === 'Concluída' ? 'Marcar A Fazer' : 'Marcar Concluída'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => remove(item)}>
          <Text style={{ color: '#dc2626' }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={!loading && (
          <Text style={{ textAlign: 'center', marginTop: 24, color: '#666' }}>
            Nenhuma tarefa ainda
          </Text>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('TaskForm')}
        style={{
          position: 'absolute', right: 16, bottom: 24,
          backgroundColor: '#111827', paddingHorizontal: 18, paddingVertical: 14,
          borderRadius: 999
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>+ Nova</Text>
      </TouchableOpacity>
    </View>
  );
}
