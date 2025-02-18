import { Stack } from 'expo-router';

export default function DemoLayout() {
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
      <Stack.Screen name="settingsStart" options={{ title: "Start Dog Settings" }} />
    </Stack>
  );
}
