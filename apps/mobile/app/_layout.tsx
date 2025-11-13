// apps/mobile/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* grupo de abas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* rotas de tarefas */}
      <Stack.Screen name="tasks/new" options={{ title: 'Nova Tarefa' }} />
      <Stack.Screen name="tasks/[id]" options={{ title: 'Detalhes da Tarefa' }} />
    </Stack>
  );
}
