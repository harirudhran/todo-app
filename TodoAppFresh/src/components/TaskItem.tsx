import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

// Maps priority to a color so users can scan the list quickly
const priorityColor = { Low: "#22C55E", Medium: "#F59E0B", High: "#EF4444" };

const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  const deadline = new Date(task.deadline);

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(task._id, !task.completed)}
      >
        <View
          style={[styles.checkboxInner, task.completed && styles.checkboxChecked]}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.strikethrough]}>
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
        <View style={styles.metaRow}>
          <View
            style={[styles.priorityBadge, { backgroundColor: priorityColor[task.priority] }]}
          >
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          <Text style={styles.deadline}>
            Due {deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onDelete(task._id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cardCompleted: { opacity: 0.6 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4F46E5",
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInner: { width: 12, height: 12, borderRadius: 6 },
  checkboxChecked: { backgroundColor: "#4F46E5" },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  strikethrough: { textDecorationLine: "line-through", color: "#888" },
  description: { fontSize: 14, color: "#555", marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
  priorityText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  deadline: { fontSize: 12, color: "#666" },
  deleteBtn: { marginLeft: 8, marginTop: 2 },
  deleteText: { color: "#EF4444", fontSize: 13, fontWeight: "600" },
});

export default TaskItem;
