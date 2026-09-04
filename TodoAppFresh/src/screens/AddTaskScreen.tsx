import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList, Priority } from "../types";
import { useTasks } from "../context/TaskContext";

type Props = NativeStackScreenProps<AppStackParamList, "AddTask">;

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

// Android's native picker only supports "date" or "time" mode, never "datetime"
// (that combined mode is iOS-only). So on Android we show the date picker first,
// and as soon as a date is picked we immediately open the time picker and merge
// the two into one Date. On iOS we can just use mode="datetime" directly.
type PickerTarget = "dateTime" | "deadline" | null;
type PickerStep = "date" | "time";

const AddTaskScreen = ({ navigation }: Props) => {
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dateTime, setDateTime] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  // Which field we're currently picking a date/time for, and (Android only) which step
  const [activePicker, setActivePicker] = useState<PickerTarget>(null);
  const [pickerStep, setPickerStep] = useState<PickerStep>("date");

  const openPicker = (target: PickerTarget) => {
    setActivePicker(target);
    setPickerStep("date"); // always start with the date step
  };

  const currentValue = activePicker === "dateTime" ? dateTime : deadline;
  const setCurrentValue = activePicker === "dateTime" ? setDateTime : setDeadline;

  const handlePickerChange = (_event: any, selected?: Date) => {
    // User cancelled (Android returns undefined `selected` on dismiss)
    if (!selected) {
      setActivePicker(null);
      return;
    }

    if (Platform.OS === "ios") {
      // iOS: mode="datetime" gives us the full value in one step
      setCurrentValue(selected);
      setActivePicker(null);
      return;
    }

    // Android: two-step flow
    if (pickerStep === "date") {
      // Keep the date the user picked, but preserve current hours/minutes for now —
      // we'll overwrite them once the time step completes.
      const merged = new Date(currentValue);
      merged.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setCurrentValue(merged);
      setPickerStep("time"); // move straight to the time picker
    } else {
      // Time step: merge the picked time into the date we already have
      const merged = new Date(currentValue);
      merged.setHours(selected.getHours(), selected.getMinutes());
      setCurrentValue(merged);
      setActivePicker(null); // done
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Please enter a task title.");
      return;
    }
    setSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        deadline: deadline.toISOString(),
        priority,
      });
      navigation.goBack();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Could not save the task.";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Finish report" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Optional details"
        multiline
      />

      <Text style={styles.label}>Date & Time</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => openPicker("dateTime")}>
        <Text>{dateTime.toLocaleString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => openPicker("deadline")}>
        <Text>{deadline.toLocaleString()}</Text>
      </TouchableOpacity>

      {/* Single shared picker instance, reused for whichever field is active */}
      {activePicker && (
        <DateTimePicker
          value={currentValue}
          mode={Platform.OS === "ios" ? "datetime" : pickerStep}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handlePickerChange}
        />
      )}

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityChip, priority === p && styles.priorityChipActive]}
            onPress={() => setPriority(p)}
          >
            <Text style={priority === p ? styles.priorityChipTextActive : styles.priorityChipText}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={submitting}>
        <Text style={styles.saveButtonText}>{submitting ? "Saving..." : "Save Task"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 16, marginBottom: 6, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: "top" },
  dateButton: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12 },
  priorityRow: { flexDirection: "row" },
  priorityChip: {
    borderWidth: 1,
    borderColor: "#4F46E5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  priorityChipActive: { backgroundColor: "#4F46E5" },
  priorityChipText: { color: "#4F46E5", fontWeight: "600" },
  priorityChipTextActive: { color: "#fff", fontWeight: "600" },
  saveButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default AddTaskScreen;