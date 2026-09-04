import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { AuthStackParamList, AppStackParamList } from "../types";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TaskListScreen from "../screens/TaskListScreen";
import AddTaskScreen from "../screens/AddTaskScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// Shown when the user is NOT logged in
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Shown when the user IS logged in
const AppNavigatorStack = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false }} />
    <AppStack.Screen name="AddTask" component={AddTaskScreen} options={{ title: "New Task" }} />
  </AppStack.Navigator>
);

// Top-level switch: picks auth flow or main app flow based on login state
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigatorStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
