// apps/mobile/app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { Tasks, type Task } from '@/src/lib/api'; // <-- alias @

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Tasks.list();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e?.message);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
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
        {/* use literal direto: mantém typedRoutes feliz */}
        <Link href="/tasks/new" style={styles.newBtn}>
          + Nova
        </Link>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        onRefresh={fetchTasks}
        refreshing={loading}
        renderItem={({ item }) => {
          // Objeto Href tipado para /tasks/[id]
          const detailsHref: Href<'/tasks/[id]'> = {
            pathname: '/tasks/[id]',
            params: { id: String(item.id) },
          };
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(detailsHref)}
            >
              <Text style={styles.title}>{item.title}</Text>
              {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
              <Text style={styles.status}>
                Status{' '}
                <Text style={item.status === 'Concluída' ? styles.done : styles.pending}>
                  {item.status}
                </Text>
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa encontrada.</Text>}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 24, fontWeight: 'bold' },
  newBtn: { backgroundColor: '#111827', color: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, overflow: 'hidden', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginTop: 12, elevation: 2 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555' },
  status: { marginTop: 8, fontSize: 12, color: '#888' },
  done: { color: 'green', fontWeight: 'bold' },
  pending: { color: 'orange', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  empty: { textAlign: 'center', marginTop: 30, color: '#777' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
});
