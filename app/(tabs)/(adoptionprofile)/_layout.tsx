import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Screens in (breed) */}
      <Stack.Screen
        name="(breed)/activityPersonality"
        options={{ title: "Activiteit & Persoonlijkheid" }}
      />
      <Stack.Screen
        name="(breed)/adoptionprofile1 copy"
        options={{ title: "Adoptieprofiel (copy)" }}
      />
      <Stack.Screen
        name="(breed)/adoptionprofile1"
        options={{ title: "Adoptieprofiel" }}
      />
      <Stack.Screen
        name="(breed)/adoptionprofileResults"
        options={{ title: "Adoptie Resultaten" }}
      />
      <Stack.Screen
        name="(breed)/experienceSize"
        options={{ title: "Ervaring & Grootte" }}
      />
      <Stack.Screen
        name="(breed)/familyEnvironment"
        options={{ title: "Gezinssituatie" }}
      />
      <Stack.Screen
        name="(breed)/groomingCoat"
        options={{ title: "Vachtverzorging" }}
      />
      <Stack.Screen
        name="(breed)/livingsituation"
        options={{ title: "Woonsituatie" }}
      />
      <Stack.Screen
        name="(breed)/soundBehavior"
        options={{ title: "Geluid & Gedrag" }}
      />
      <Stack.Screen
        name="(breed)/breedDetail/[id]"
        options={{ title: "Ras Detail" }}
      />

      {/* Screens in (intro) */}
      <Stack.Screen
        name="(intro)/adoptionBreed"
        options={{ title: "Adoptie ras" }}
      />
      <Stack.Screen
        name="(intro)/adoptionIntro"
        options={{ title: "Introductie" }}
      />
      <Stack.Screen
        name="(intro)/missingAdoptionProfile"
        options={{ title: "Ontbrekend Profiel" }}
      />
      <Stack.Screen
        name="(intro)/adoptionChoice"
        options={{ title: "Keuze Profiel" }}
      />

      {/* Screens in (personality) */}
      <Stack.Screen
        name="(personality)/dogAge"
        options={{ title: "Leeftijd Hond" }}
      />
      <Stack.Screen
        name="(personality)/energy"
        options={{ title: "Energie" }}
      />
      <Stack.Screen
        name="(personality)/interaction"
        options={{ title: "Interactie" }}
      />
      <Stack.Screen
        name="(personality)/matching"
        options={{ title: "Matching" }}
      />
      <Stack.Screen
        name="(personality)/personalityTraits"
        options={{ title: "Karaktereigenschappen" }}
      />
      <Stack.Screen
        name="(personality)/trainingLevel"
        options={{ title: "Trainingsniveau" }}
      />
      <Stack.Screen
        name="(personality)/dogDetail/[id]"
        options={{ title: "Hond Detail" }}
      />
    </Stack>
  );
}
