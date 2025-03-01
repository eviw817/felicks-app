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
      <Stack.Screen name="dogStart" options={{ title: "Start Dog Settings" }} />
      <Stack.Screen name="dogBreed" options={{ title: "Choose Dog Breed" }} />
    </Stack>
  );
}
