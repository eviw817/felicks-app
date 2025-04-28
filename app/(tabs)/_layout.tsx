import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
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