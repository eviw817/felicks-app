import { Stack } from 'expo-router';

export default function signOutLayout() {
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
      <Stack.Screen name="signOut" options={{ title: "Sign out" }} />

    </Stack>
  );
}