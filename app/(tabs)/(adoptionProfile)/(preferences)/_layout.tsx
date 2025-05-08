import { Stack } from 'expo-router';

export default function AdoptionProfileLayout() {
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
      <Stack.Screen name="preference1" options={{ title: "Preference 1" }} />
      <Stack.Screen name="preference2" options={{ title: "Preference 2" }} />
    </Stack>
  );
}