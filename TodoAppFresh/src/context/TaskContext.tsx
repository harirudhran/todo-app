import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
} from "../api/api";
import { Task, Priority } from "../types";

interface NewTaskInput {
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: NewTaskInput) => Promise<void>;
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTasksRequest();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task: NewTaskInput) => {
    const { data } = await createTaskRequest(task);
    setTasks((prev) => [...prev, data]);
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const { data } = await updateTaskRequest(id, { completed });
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const removeTask = async (id: string) => {
    await deleteTaskRequest(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, fetchTasks, addTask, toggleComplete, removeTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
};
