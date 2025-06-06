import { Stack } from "expo-router";

export default function BreedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="dogAge" options={{ title: "Dog Age" }} />
      <Stack.Screen name="energy" options={{ title: "Energy" }} />
      <Stack.Screen name="interaction" options={{ title: "Interaction" }} />
      <Stack.Screen name="matching" options={{ title: "Matching" }} />
      <Stack.Screen name="personalityTraits" options={{ title: "Personality Traits" }} />
      <Stack.Screen name="trainingLevel" options={{ title: "Training Level" }} />
    </Stack>
  );
}
