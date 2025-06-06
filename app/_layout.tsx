"use client";

import React, { useState, useCallback, useEffect } from "react";
import { SplashScreen, Stack, Slot, useRouter, usePathname } from "expo-router";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import InAppBanner from "@/components/InAppBanner";
import { initRealtimeNotifications } from "@/lib/realtimeNotifications";
import { supabase } from "@/lib/supabase"; 

// BADGE UPDATERS HOMEPAGE
export let badgeUpdateCallback: () => void = () => {};
export function registerBadgeCallback(cb: () => void) {
  badgeUpdateCallback = cb;
}

export default function RootLayout() {
  console.log("Layout geladen");

  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMonoRegular.ttf"),
    Nunito: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const [bannerTitle, setBannerTitle] = useState<string | null>(null);
  const [bannerBody, setBannerBody] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  const handleBannerNotify = useCallback((title: string, body: string) => {
    console.log("[RootLayout][handleBannerNotify] ► Showing banner:", title, "|", body);
    setBannerTitle(title);
    setBannerBody(body);
  }, []);

  const handleBadgeUpdate = useCallback(() => {
    console.log("[RootLayout][handleBadgeUpdate] ► forceren fetchUnreadNotifications");
    badgeUpdateCallback();
  }, []);

  const handleBannerHide = useCallback(() => {
    console.log("[RootLayout][handleBannerHide] ► Hiding banner");
    setBannerTitle(null);
    setBannerBody("");
  }, []);

  const handleBannerPress = useCallback(() => {
    console.log("[RootLayout][handleBannerPress] ► Navigating to /notificationsIndex");
    if (pathname !== "/notificationsIndex") {
      router.push("/notificationsIndex");
    }
    setBannerTitle(null);
    setBannerBody("");
  }, [pathname, router]);

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

  useEffect(() => {
  const initSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.log("[RootLayout][initSession] Fout bij ophalen sessie:", error.message);
      return;
    }

    if (session) {
      console.log("[RootLayout][initSession] Sessie gevonden bij opstart.");
      supabase.auth.startAutoRefresh();
      initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
    } else {
      console.log("[RootLayout][initSession] Geen sessie bij opstart.");
      supabase.auth.stopAutoRefresh();
    }
  };

  initSession();

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      console.log("[RootLayout][onAuthStateChange] Sessie actief → startAutoRefresh + realtime");
      supabase.auth.startAutoRefresh();
      initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
    } else {
      console.log("[RootLayout][onAuthStateChange] Geen sessie meer → stopAutoRefresh");
      supabase.auth.stopAutoRefresh();
    }
  });

  return () => {
    authListener?.subscription?.unsubscribe();
  };
}, [handleBannerNotify, handleBadgeUpdate]);

  if (!loaded) return null;

  return (
    <>
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
    </>
  );
}
