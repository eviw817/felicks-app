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
      <Stack.Screen name="adoptionProfileLoading" options={{ title: "Adoption profile loading" }} />
      <Stack.Screen name="adoptionProfileStart" options={{ title: "Adoption profile start" }} />
      <Stack.Screen name="experience" options={{ title: "Dog experience" }} />
      <Stack.Screen name="motivation" options={{ title: "Motivation to get a dog" }} />
    </Stack>
  );
}