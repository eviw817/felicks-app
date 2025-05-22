import { Stack } from 'expo-router';

export default function ProfileLayout() {
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
      <Stack.Screen name="artikel" options={{ title: "Artikels" }} />
      <Stack.Screen name="artikelsIndex" options={{ title: "Artikels Index" }} />
    </Stack>
  );
}