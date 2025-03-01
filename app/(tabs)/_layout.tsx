import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
      {/* Home Tab */}
      <Stack.Screen
        name="(home)" // Verwijst naar de map app/(tabs)/(home)
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      {/* Demo Tab */}
      <Stack.Screen
        name="(demo)" // Verwijst naar de map app/(tabs)/(demo)
        options={{
          title: "Demo",
          headerShown: false,
        }}
      />
      {/* Dog-settings Tab */}
      <Stack.Screen
        name="(dog-settings)" // Verwijst naar de map app/(tabs)/(demo)
        options={{
          title: "Dog settings",
          headerShown: false,
        }}
      />
      {/* Dog-information Tab */}
      <Stack.Screen
        name="(dog-information)" // Verwijst naar de map app/(tabs)/(demo)
        options={{
          title: "Dog information",
          headerShown: false,
        }}
      />
    </Stack> //voor een navigatie te maken moet alles Tabs zijn, dus ook Tabs.Scree
  );
}
