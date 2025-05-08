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
      {/* notifications Tab */}
      <Stack.Screen
        name="(notifications)" // Verwijst naar de map app/(tabs)/(notifications)
        options={{
          title: "Notifications",
          headerShown: false,
        }}
      />
      {/* login Tab */}
      <Stack.Screen
        name="(login-register)" // Verwijst naar de map app/(tabs)/(login-register)
        options={{
          title: "Login or Register",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(adoptionProfile)" // Verwijst naar de map app/(tabs)/(adoptionProfile)
        options={{
          title: "Adoption profile",
          headerShown: false,
        }}
      />
    </Stack> //voor een navigatie te maken moet alles Tabs zijn, dus ook Tabs.Scree
  );
}