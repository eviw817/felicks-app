import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={
        {
          headerShown: false // Hide the header
        }
      }>
      <Stack.Screen name="index" /> // Show index.tsx
      <Stack.Screen name="demo" /> // Show demo.tsx
    </Stack>
  );
}