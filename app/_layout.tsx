import { Stack } from "expo-router";



export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="bewustzijn-index" options={{ headerShown: false }} />

      <Stack.Screen name="quiz_index" options={{ headerShown: false }} />
      <Stack.Screen name="quiz-vragen" options={{ headerShown: false }} />

      <Stack.Screen name="artikels_index" options={{ headerShown: false }} />
      <Stack.Screen name="artikel" options={{ headerShown: false }} />
    </Stack>
  );
}