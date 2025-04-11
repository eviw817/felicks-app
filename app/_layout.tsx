import { Stack } from "expo-router";
import { AdoptionProfileProvider } from "../context/AdoptionProfileContext"; // importeren

export default function RootLayout() {
  return (
    <AdoptionProfileProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AdoptionProfileProvider>
  );
}
