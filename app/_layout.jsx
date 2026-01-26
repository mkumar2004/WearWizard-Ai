import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from 'react-redux';
import store from '../src/redux/Store';


export default function RootLayout() {
  return (
    <Provider store={store}>
    <SafeAreaProvider>
      

    
      <StatusBar style="dark" />
      
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="OnBoarding/Bording" />
        <Stack.Screen name="auth/Login" />
        <Stack.Screen name="auth/Register" /> */}
        <Stack.Screen name="(tabs)" />
      </Stack>

      <Toast />
   
    </SafeAreaProvider>
      </Provider>
  );
}
