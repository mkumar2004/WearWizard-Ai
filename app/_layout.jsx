import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../src/redux/Store';
import { useEffect } from "react";
import { AuthloadState } from "../src/redux/slice/Auth";

import { ActivityIndicator, View } from "react-native";

function Initializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AuthloadState());
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="OnBoarding/Bording" />
      <Stack.Screen name="auth/Login" />
      <Stack.Screen name="auth/Register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Initializer />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}
