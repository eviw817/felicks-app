import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="adoption_profile" options={{ title: "Adoptieprofiel" }} />
    </Stack>
  );
}
