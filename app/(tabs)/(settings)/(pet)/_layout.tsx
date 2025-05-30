import { Stack } from 'expo-router';

export default function PetLayout() {
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
      <Stack.Screen name="pet" options={{ title: "Pet" }} />
      <Stack.Screen name="removePet" options={{ title: "Remove pet" }} />
      <Stack.Screen name="removeSecondPet" options={{ title: "Remove second page pet" }} />

    </Stack>
  );
}