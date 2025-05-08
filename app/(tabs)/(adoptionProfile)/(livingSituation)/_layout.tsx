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
      <Stack.Screen name="livingSituation1" options={{ title: "Living situation 1" }} />
      <Stack.Screen name="livingSituation2" options={{ title: "Living situation 2" }} />
      <Stack.Screen name="livingSituation3" options={{ title: "Living situation 3" }} />
    </Stack>
  );
}