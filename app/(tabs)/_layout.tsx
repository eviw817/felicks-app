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
      <Stack.Screen
        name="(bewustzijn)" // Verwijst naar de map app/(tabs)/(adoptionProfile)
        options={{
          title: "Bewustzijn",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(dog-ar)" // Verwijst naar de map app/(tabs)/(adoptionProfile)
        options={{
          title: "Dog AR",
          headerShown: false,
        }}
      />
    </Stack> //voor een navigatie te maken moet alles Tabs zijn, dus ook Tabs.Scree

  );
}