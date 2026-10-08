import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Task = { id: string; title: string; completed: boolean };

export default function App() {
  return (
    <SafeAreaProvider>
      <Daylist />
    </SafeAreaProvider>
  );
}

function Daylist() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const nextId = useRef(1);
  const inputRef = useRef<TextInput>(null);
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = tasks.length - completed;

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  function addTask() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Give your task a name first.');
      inputRef.current?.focus();
      return;
    }
    const task = { id: String(nextId.current++), title: trimmedTitle, completed: false };
    setTasks((current) => [...current, task]);
    setTitle('');
    setError('');
    inputRef.current?.focus();
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <View style={[styles.brandRow, keyboardOpen && styles.compactBrand]}>
            <Text style={styles.brand}>daylist<Text style={styles.brandDot}>.</Text></Text>
            <View style={styles.badge}><Text style={styles.badgeText}>ONE THING AT A TIME</Text></View>
          </View>
          {!keyboardOpen && <View>
          <Text style={styles.heading}>Make room for{ '\n' }a lighter day.</Text>
          <Text style={styles.subtitle}>Small steps. A little more headspace.</Text>
          <View style={styles.summary}>
            <View>
              <Text style={styles.summaryLabel}>YOUR PROGRESS</Text>
              <Text style={styles.summaryTitle}>
                {tasks.length === 0 ? 'A fresh start' : remaining === 0 ? 'All done. Nicely done!' : `${remaining} ${remaining === 1 ? 'task' : 'tasks'} to go`}
              </Text>
            </View>
            <View style={styles.counter}><Text style={styles.counterText}>{completed}<Text style={styles.counterTotal}> / {tasks.length}</Text></Text></View>
          </View>
          <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityLabel="Task progress" accessibilityValue={{ min: 0, max: tasks.length || 1, now: completed }}>
            <View style={[styles.progressFill, { width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }]} />
          </View>
          </View>}
        </View>

        <View style={styles.listHeading}>
          <Text style={styles.sectionTitle}>Your tasks</Text>
          <Text style={styles.listHint}>Tap the circle to finish</Text>
        </View>
        <FlatList
          style={styles.list}
          contentContainerStyle={[styles.listContent, tasks.length === 0 && styles.emptyList]}
          data={tasks}
          keyExtractor={(task) => task.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.taskCard, item.completed && styles.finishedCard]}>
              <Pressable
                style={styles.checkTarget}
                onPress={() => toggleTask(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.completed }}
                accessibilityLabel={item.title}
                accessibilityHint={item.completed ? 'Mark this task as unfinished' : 'Mark this task as complete'}
              >
                <View style={[styles.checkCircle, item.completed && styles.checkedCircle]}>
                  {item.completed ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
              </Pressable>
              <View style={styles.taskText}>
                <Text style={[styles.taskTitle, item.completed && styles.finishedTitle]}>{item.title}</Text>
                <Text style={styles.taskMeta}>{item.completed ? 'COMPLETED' : `TASK ${String(index + 1).padStart(2, '0')}`}</Text>
              </View>
              <Pressable onPress={() => deleteTask(item.id)} style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Delete task: ${item.title}`}>
                <Text style={styles.deleteSymbol}>×</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Text style={styles.emptySymbol}>☀</Text></View>
              <Text style={styles.emptyTitle}>A little space to breathe.</Text>
              <Text style={styles.emptyDescription}>Nothing on your list yet.{ '\n' }Add one small thing to get started.</Text>
            </View>
          }
        />

        <View style={styles.composer}>
          <Text style={styles.inputLabel}>{"WHAT'S NEXT?"}</Text>
          <View style={[styles.inputRow, !!error && styles.inputError]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Add a little to-do…"
              placeholderTextColor="#7C837C"
              value={title}
              onChangeText={(text) => { setTitle(text); setError(''); }}
              onSubmitEditing={addTask}
              returnKeyType="done"
              submitBehavior="submit"
              maxLength={160}
              accessibilityLabel="New task"
              accessibilityHint="Enter a task, then tap Add task"
            />
            <Pressable onPress={addTask} accessibilityRole="button" accessibilityLabel="Add task" style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Text style={styles.addSymbol}>+</Text>
            </Pressable>
          </View>
          {error ? <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text> : <Text style={styles.footer}>Less on your mind. More in your day.</Text>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8F2' },
  page: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 28 },
  compactBrand: { marginBottom: 0 },
  brand: { fontSize: 28, fontWeight: '800', color: '#243C32', letterSpacing: -1.5 },
  brandDot: { color: '#7E9C67' },
  badge: { backgroundColor: '#E8EEDF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, flexShrink: 1 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: '#526546' },
  heading: { fontSize: 37, fontWeight: '700', lineHeight: 43, letterSpacing: -1.4, color: '#243C32' },
  subtitle: { fontSize: 14, lineHeight: 21, color: '#6C776B', marginTop: 12 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28 },
  summaryLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: '#707C68', marginBottom: 6 },
  summaryTitle: { fontSize: 17, fontWeight: '600', color: '#243C32' },
  counter: { backgroundColor: '#E8EEDF', paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12 },
  counterText: { color: '#243C32', fontSize: 18, fontWeight: '700' },
  counterTotal: { color: '#687960', fontSize: 13, fontWeight: '500' },
  progressTrack: { height: 5, backgroundColor: '#E3E8DC', borderRadius: 4, overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', backgroundColor: '#648451', borderRadius: 4 },
  listHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 24, paddingBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#243C32' },
  listHint: { fontSize: 11, color: '#6C776B', flexShrink: 1 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 16, gap: 10 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  taskCard: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 6, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E5E9DF' },
  finishedCard: { backgroundColor: '#EEF2E7' },
  checkTarget: { minWidth: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  checkCircle: { width: 25, height: 25, borderRadius: 13, borderWidth: 1.5, borderColor: '#9EAC95', alignItems: 'center', justifyContent: 'center' },
  checkedCircle: { backgroundColor: '#49673C', borderColor: '#49673C' },
  checkMark: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  taskText: { flex: 1, paddingVertical: 3 },
  taskTitle: { color: '#243C32', fontSize: 16, lineHeight: 23, fontWeight: '500' },
  finishedTitle: { textDecorationLine: 'line-through', color: '#687662' },
  taskMeta: { color: '#6C776B', fontSize: 9, letterSpacing: 1.2, marginTop: 5 },
  deleteButton: { width: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  deleteSymbol: { fontSize: 26, color: '#76816F', fontWeight: '300' },
  pressed: { opacity: 0.55 },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EFECD6', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptySymbol: { fontSize: 39, color: '#958641' },
  emptyTitle: { fontSize: 19, fontWeight: '600', color: '#3D5139', textAlign: 'center' },
  emptyDescription: { fontSize: 14, lineHeight: 22, color: '#6C776B', textAlign: 'center', marginTop: 8 },
  composer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, borderTopWidth: 1, borderTopColor: '#E5E9DF' },
  inputLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: '#526546', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 6, paddingLeft: 16, borderWidth: 1, borderColor: '#D5DDCC', backgroundColor: '#FFFFFF', borderRadius: 18, gap: 6 },
  inputError: { borderColor: '#A14335' },
  input: { flex: 1, fontSize: 16, color: '#243C32', minHeight: 44, paddingVertical: 10 },
  addButton: { width: 46, height: 46, backgroundColor: '#243C32', borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  addSymbol: { color: '#FFFFFF', fontSize: 30, fontWeight: '300', lineHeight: 34 },
  footer: { textAlign: 'center', color: '#6C776B', fontSize: 11, lineHeight: 16, marginTop: 12 },
  error: { color: '#A14335', fontSize: 12, lineHeight: 16, marginTop: 12 },
});
