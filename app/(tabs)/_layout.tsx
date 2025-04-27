import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
      {/* Index Tab */}
      <Stack.Screen
        name="(home)" // Verwijst naar de map app/(tabs)/(index)
        options={{
          title: "Index",
          headerShown: false,
        }}
      />
      {/* Homepage Tab */}
      <Stack.Screen
        name="(homepage)" // Verwijst naar de map app/(tabs)/(homepage)
        options={{
          title: "Homepage",
          headerShown: false,
        }}
      />
    </Stack> //voor een navigatie te maken moet alles Tabs zijn, dus ook Tabs.Scree
  );
}