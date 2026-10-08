import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

type Task = { id: string; title: string; completed: boolean };

export default function App() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  function addTask() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task.');
      return;
    }
    setTasks((current) => [...current, { id: `${Date.now()}-${Math.random()}`, title: trimmedTitle, completed: false }]);
    setTitle('');
    setError('');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>Daylist</Text>
      <TextInput style={styles.input} placeholder="What needs to get done?" value={title} onChangeText={setTitle} onSubmitEditing={addTask} />
      <Button title="Add task" onPress={addTask} />
      {error ? <Text>{error}</Text> : null}
      <FlatList data={tasks} keyExtractor={(task) => task.id} renderItem={({ item }) => (
        <View style={styles.row}>
          <Button title={item.completed ? 'Undo' : 'Done'} onPress={() => setTasks((current) => current.map((task) => task.id === item.id ? { ...task, completed: !task.completed } : task))} />
          <Text style={[styles.task, item.completed && styles.completed]}>{item.title}</Text>
          <Button title="Delete" onPress={() => setTasks((current) => current.filter((task) => task.id !== item.id))} />
        </View>
      )} ListEmptyComponent={<Text>Your list is clear. Add your first task.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#F7F7F2', gap: 16 },
  heading: { fontSize: 36, fontWeight: '700' },
  input: { padding: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 12 },
  task: { flex: 1, paddingVertical: 16, fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  completed: { textDecorationLine: 'line-through', color: '#777' },
});
