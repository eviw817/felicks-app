"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AdoptionProfileProvider } from "../context/AdoptionProfileContext";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Slot, useRouter, usePathname } from "expo-router";
import InAppBanner from "@/components/InAppBanner";
import { initRealtimeNotifications } from "@/lib/realtimeNotifications";
import { supabase } from "@/lib/supabase"; // <-- vergeet deze import niet!

// ─── VOOR DE BADGE UPDATERS ───────────────────────────────────────────────
export let badgeUpdateCallback: () => void = () => {};
export function registerBadgeCallback(cb: () => void) {
  badgeUpdateCallback = cb;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMonoRegular.ttf"),
    Nunito: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  // Banner state
  const [bannerTitle, setBannerTitle] = useState<string | null>(null);
  const [bannerBody, setBannerBody] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  // Callback om banner in te stellen
  const handleBannerNotify = useCallback((title: string, body: string) => {
    console.log("[RootLayout][handleBannerNotify] ► Showing banner:", title, "|", body);
    setBannerTitle(title);
    setBannerBody(body);
  }, []);

  // Callback om badge in Homepage bij te werken
  const handleBadgeUpdate = useCallback(() => {
    console.log("[RootLayout][handleBadgeUpdate] ► forceren fetchUnreadNotifications");
    badgeUpdateCallback();
  }, []);

  // Banner sluiten (X‐knop)
  const handleBannerHide = useCallback(() => {
    console.log("[RootLayout][handleBannerHide] ► Hiding banner");
    setBannerTitle(null);
    setBannerBody("");
  }, []);

  // Tap op banner → navigeer naar /notificationsIndex
  const handleBannerPress = useCallback(() => {
    console.log("[RootLayout][handleBannerPress] ► Navigating to /notificationsIndex");
    if (pathname !== "/notificationsIndex") {
      router.push("/notificationsIndex");
    }
    setBannerTitle(null);
    setBannerBody("");
  }, [pathname, router]);

  // Init realtime zodra er een geldige sessie is
  useEffect(() => {
    const fetchSessionAndStartRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("[RootLayout] Geldige sessie, start realtime...");
        initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
      } else {
        console.log("[RootLayout] Geen sessie gevonden.");
      }
    };

    fetchSessionAndStartRealtime();
  }, [handleBannerNotify, handleBadgeUpdate]);

  // Extra fallback: luister op nieuwe login
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log("[RootLayout] Nieuwe login gedetecteerd → realtime opnieuw starten");
        initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [handleBannerNotify, handleBadgeUpdate]);

  if (!fontsLoaded) return null;

  return (
    <AdoptionProfileProvider>
      {bannerTitle !== null && (
        <InAppBanner
          title={bannerTitle}
          body={bannerBody}
          onHide={handleBannerHide}
          onPress={handleBannerPress}
        />
      )}
      <Slot />
      <StatusBar />
    </AdoptionProfileProvider>
  );
}
