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
      <Stack.Screen name="adoptieIndex" options={{ title: "Adoptie Index" }} />
      <Stack.Screen name="missingAdoptionProfile" options={{ title: "Missing Adoption Profile" }} />
      <Stack.Screen name="AdoptionChoice" options={{ title: "Adoption Choice" }} />
    </Stack>
  );
}