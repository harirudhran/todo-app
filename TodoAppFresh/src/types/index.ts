export type Priority = "Low" | "Medium" | "High";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dateTime: string; // ISO date string
  deadline: string; // ISO date string
  priority: Priority;
  completed: boolean;
}

export interface User {
  _id: string;
  email: string;
  token: string;
}

// Screens available in the auth (logged-out) stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Screens available in the main (logged-in) stack
export type AppStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};
