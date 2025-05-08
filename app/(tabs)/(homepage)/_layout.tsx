import { Stack } from 'expo-router';

export default function HomepageLayout() {
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
      <Stack.Screen name="homepage" options={{ title: "Homepage" }} />
    </Stack>
  );
}