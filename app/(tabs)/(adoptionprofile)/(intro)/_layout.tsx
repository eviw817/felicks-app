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
        name="adoptionBreed"
        options={{ title: "Adoption Breed" }}
      />
      <Stack.Screen
        name="adoptionChoice"
        options={{ title: "Adoption Choice" }}
      />
      <Stack.Screen
        name="adoptionIntro"
        options={{ title: "Adoption Intro" }}
      />
      <Stack.Screen
        name="missingAdoptionProfile"
        options={{ title: "Missing Adoption Profile" }}
      />
    </Stack>
  );
}
