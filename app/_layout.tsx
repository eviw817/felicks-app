// app/_layout.tsx
import React, { useState } from "react";
import { SplashScreen, Slot } from "expo-router";
import { AdoptionProfileProvider } from "../context/AdoptionProfileContext";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

import NotificationListener from "@/components/PushNotifications";
import InAppBanner from "@/components/InAppBanner";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMonoRegular.ttf"),
    Nunito: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const [bannerTitle, setBannerTitle] = useState<string | null>(null);
  const [bannerBody, setBannerBody] = useState<string>("");

  const router = useRouter();

  // Gebeurt als NotificationListener iets meld
  const handleNotify = (title: string, body: string) => {
    setBannerTitle(title);
    setBannerBody(body);
  };

  // Gebeurt als banner sluit
  const handleBannerHide = () => {
    setBannerTitle(null);
    setBannerBody("");
  };

  // Gebeurt als je op de banner drukt:
  const handleBannerPress = () => {
    router.push("/notificationsIndex");
  };

  if (!fontsLoaded) return null;

  return (
    <AdoptionProfileProvider>
      {bannerTitle !== null && (
        <InAppBanner
          title={bannerTitle}
          body={bannerBody}
          onHide={handleBannerHide}
          onPress={handleBannerPress} // navigeer naar notificationsIndex
        />
      )}

      <NotificationListener onNotify={handleNotify} />

      <Slot />
      <StatusBar />
    </AdoptionProfileProvider>
  );
}
