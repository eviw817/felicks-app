import { SplashScreen, Stack } from "expo-router";
import { AdoptionprofileProvider } from "../context/AdoptionprofileContext"; // importeren
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMonoRegular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <AdoptionprofileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar />
    </AdoptionprofileProvider>
  );
}
