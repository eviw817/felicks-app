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
      <Stack.Screen name="dogInfo" options={{ title: "Dog info" }} />
      <Stack.Screen name="suitableDogs" options={{ title: "Suitable dogs" }} />
    </Stack>
  );
}