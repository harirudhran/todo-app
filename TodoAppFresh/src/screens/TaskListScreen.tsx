import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import TaskItem from "../components/TaskItem";

type Props = NativeStackScreenProps<AppStackParamList, "TaskList">;

const TaskListScreen = ({ navigation }: Props) => {
  const { tasks, loading, fetchTasks, toggleComplete, removeTask } = useTasks();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets(); // avoids the header sitting under the status bar

  // Load the user's tasks the first time this screen mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Wrapped so any failure (e.g. AsyncStorage issue) is visible instead of silently
  // doing nothing — remove the Alert/console.log once you've confirmed it's solid.
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Logout failed", "Something went wrong logging you out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>{user?.email}</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      {loading && tasks.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4F46E5" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchTasks} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No tasks yet. Tap + to add one.</Text>
          }
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleComplete} onDelete={removeTask} />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  headerSubtitle: { fontSize: 13, color: "#777", marginTop: 2 },
  logoutButton: { padding: 4 },
  logout: { color: "#EF4444", fontWeight: "600" },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: { textAlign: "center", color: "#999", marginTop: 60 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 30 },
});

export default TaskListScreen;