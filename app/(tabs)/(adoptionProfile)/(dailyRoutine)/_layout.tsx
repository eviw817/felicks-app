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
      <Stack.Screen name="dailyRoutine1" options={{ title: "Daily routine 1" }} />
      <Stack.Screen name="dailyRoutine2" options={{ title: "Daily routine 2" }} />
    </Stack>
  );
}