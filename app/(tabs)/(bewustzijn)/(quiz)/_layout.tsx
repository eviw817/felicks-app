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
      <Stack.Screen name="quizIndex" options={{ title: "Quiz Index" }} />
      <Stack.Screen name="quizVragen" options={{ title: "Quiz Index" }} />
    </Stack>
  );
}