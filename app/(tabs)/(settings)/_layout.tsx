import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f451red1e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen name="afmelden" options={{ title: "Afmelden" }} />
      <Stack.Screen name="hulp" options={{ title: "Hulp" }} />
      <Stack.Screen name="notification" options={{ title: "Notification" }} />
      <Stack.Screen name="pet" options={{ title: "Pet" }} />

    </Stack>
  );
}