import { Stack } from 'expo-router';

export default function NotificationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="notification" options={{ title: "Notification" }} />

    </Stack>
  );
}