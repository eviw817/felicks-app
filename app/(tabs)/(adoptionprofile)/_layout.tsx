import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
      {/* Dog Breed Tab */}
      <Stack.Screen
        name="(personality)" // Verwijst naar de map app/(tabs)/(profile)
        options={{
          title: "Dog Personality",
          headerShown: false,
        }}
      />
      {/* Dog Breed Tab */}
      <Stack.Screen
        name="(intro)" // Verwijst naar de map app/(tabs)/(settings)
        options={{
          title: "Adoptionprofiel Intro",
          headerShown: false,
        }}
      />

      {/* Dog Breed Tab */}
      <Stack.Screen
        name="(breed)" // Verwijst naar de map app/(tabs)/(homepage)
        options={{
          title: "Dog Breed",
          headerShown: false,
        }}
      />
    </Stack> //voor een navigatie te maken moet alles Tabs zijn, dus ook Tabs.Scree
  );
}
