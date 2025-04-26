import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="adoption_profile"
        options={{ title: "Adoptieprofiel", headerShown: false }}
      />
      <Stack.Screen
        name="living_situation_1"
        options={{ title: "Woonsituatie", headerShown: false }}
      />
      <Stack.Screen
        name="living_situation_2"
        options={{ title: "Woonsituatie", headerShown: false }}
      />
      <Stack.Screen
        name="living_situation_3"
        options={{ title: "Woonsituatie", headerShown: false }}
      />
      <Stack.Screen
        name="daily_routine_1"
        options={{ title: "Dagelijkse routine", headerShown: false }}
      />
      <Stack.Screen
        name="daily_routine_2"
        options={{ title: "Dagelijkse routine", headerShown: false }}
      />
      <Stack.Screen
        name="experience"
        options={{ title: "Ervaring", headerShown: false }}
      />
      <Stack.Screen
        name="preference_1"
        options={{ title: "Voorkeur", headerShown: false }}
      />
      <Stack.Screen
        name="preference_2"
        options={{ title: "Voorkeur", headerShown: false }}
      />
      <Stack.Screen name="motivation" options={{ title: "Motivatie" }} />
      <Stack.Screen
        name="adoption_profile_loading"
        options={{ title: "Adoptieprofiel", headerShown: false }}
      />
      <Stack.Screen
        name="suitable_dogs"
        options={{ title: "Geschikte honden", headerShown: false }}
      />
      <Stack.Screen
        name="suitable_dogs_1"
        options={{ title: "Geschikte honden", headerShown: false }}
      />
      <Stack.Screen
        name="TestAdoptionProfile"
        options={{ title: "TestAdoptionProfile", headerShown: false }}
      />

      <Stack.Screen name="dog_info" options={{ title: "Hondeninformatie" }} />
    </Stack>
  );
}
