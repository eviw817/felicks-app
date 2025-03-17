import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="bewustzijn-index" options={{ headerShown: false }} />
      <Stack.Screen name="quiz_index" options={{ headerShown: false }} />
    </Stack>
  );
}