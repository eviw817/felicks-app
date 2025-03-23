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
      <Stack.Screen name="arLoader" options={{ title: "AR Loader" }} />
      <Stack.Screen name="arStart" options={{ title: "AR start" }} />
    </Stack>
  );
}
