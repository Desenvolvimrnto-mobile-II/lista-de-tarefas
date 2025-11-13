// apps/mobile/app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { Tasks, type Task } from '@/src/lib/api';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      const data = await Tasks.list();

      // cobre os dois formatos: array direto ou { tasks: [...] }
      const list: Task[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.tasks)
        ? (data as any).tasks
        : [];

      console.log('📥 Tasks carregadas:', list);
      setTasks(list);
    } catch (e: any) {
      console.error('❌ Erro ao carregar tarefas:', e?.response?.data || e?.message || e);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }, []);

  // primeira carga
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // recarrega sempre que a tela volta a ganhar foco
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks]),
  );

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>📋 Minhas Tarefas</Text>
        <Link href="/tasks/new" style={styles.newBtn}>
          + Nova
        </Link>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        onRefresh={fetchTasks}
        refreshing={loading && tasks.length > 0}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            // cast para calar o TypeScript chato sem perder a navegação
            onPress={() => router.push(`/tasks/${item.id}` as never)}
          >
            <Text style={styles.title}>{item.title}</Text>
            {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
            <Text style={styles.status}>
              Status{' '}
              <Text
                style={
                  item.status === 'Concluída'
                    ? styles.done
                    : styles.pending
                }
              >
                {item.status}
              </Text>
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>Nenhuma tarefa encontrada.</Text>
          ) : null
        }
        contentContainerStyle={
          tasks.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20, paddingTop: 60 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: { fontSize: 24, fontWeight: 'bold' },
  newBtn: {
    backgroundColor: '#111827',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555' },
  status: { marginTop: 8, fontSize: 12, color: '#888' },
  done: { color: 'green', fontWeight: 'bold' },
  pending: { color: 'orange', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  empty: { textAlign: 'center', marginTop: 30, color: '#777' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
});
