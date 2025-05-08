import { Stack } from 'expo-router';

export default function ProfileEditLayout() {
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
      <Stack.Screen name="profileEdit" options={{ title: "Edit profile" }} />
    </Stack>
  );
}