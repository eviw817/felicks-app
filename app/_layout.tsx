import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="adoption_profile" options={{ title: "Adoptieprofiel" }} />
      <Stack.Screen name="living_situation_1" options={{ title: "Woonsituatie" }} />
      <Stack.Screen name="living_situation_2" options={{ title: "Woonsituatie" }} />
      <Stack.Screen name="living_situation_3" options={{ title: "Woonsituatie" }} />
    </Stack>
  );
}
