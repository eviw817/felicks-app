import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
      {/* Profiel Tab */}
      <Stack.Screen
        name="(profile)" // Verwijst naar de map app/(tabs)/(profile)
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      {/* Setting Tab */}
      <Stack.Screen
        name="(settings)" // Verwijst naar de map app/(tabs)/(settings)
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Stack> 
  );
}