import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [tasks, setTasks] = useState([]);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'; // Emulador Android

  useEffect(() => {
    axios.get(`${API_URL}/api/tasks`)
      .then(response => setTasks(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Lista de Tarefas</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.task}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDesc}>{item.description}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  task: { marginBottom: 15, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10 },
  taskTitle: { fontSize: 18, fontWeight: 'bold' },
  taskDesc: { fontSize: 14, color: '#555' },
  status: { marginTop: 5, fontSize: 12, color: '#999' },
});
