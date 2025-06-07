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
      <Stack.Screen
        name="activityPersonality"
        options={{ title: "Activity Personality" }}
      />
      <Stack.Screen
        name="adoptionProfileResults"
        options={{ title: "Adoption Profile Results" }}
      />
      <Stack.Screen
        name="experienceSize"
        options={{ title: "Experience Size" }}
      />
      <Stack.Screen
        name="familyEnvironment"
        options={{ title: "Family Environment" }}
      />
      <Stack.Screen name="groomingCoat" options={{ title: "Grooming Coat" }} />
      <Stack.Screen
        name="livingSituation"
        options={{ title: "Activity Personality" }}
      />
      <Stack.Screen
        name="soundBehavior"
        options={{ title: "Sound Behavior" }}
      />
    </Stack>
  );
}
