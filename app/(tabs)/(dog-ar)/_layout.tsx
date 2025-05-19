import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>

      {/* Profiel Tab */}
      <Stack.Screen
        name="(demo)" // Verwijst naar de map app/(tabs)/(profile)
        options={{
          title: "Demo",
          headerShown: false,
        }}
      />
      {/* Setting Tab */}
      <Stack.Screen
        name="(dog-ar-starter)" // Verwijst naar de map app/(tabs)/(settings)
        options={{
          title: "Dog AR starter",
          headerShown: false,
        }}
      />
  
      {/* Homepage Tab */}
      <Stack.Screen
        name="(dog-information)" // Verwijst naar de map app/(tabs)/(homepage)
        options={{
          title: "Dog Information",
          headerShown: false,
        }}
      />
      {/* notifications Tab */}
      <Stack.Screen
        name="(dog-settings)" // Verwijst naar de map app/(tabs)/(notifications)
        options={{
          title: "Dog Settings",
          headerShown: false,
        }}
      />
    </Stack> //voor een navigatie te maken moet alles Tabs zijn, dus ook Tabs.Scree

  );
}