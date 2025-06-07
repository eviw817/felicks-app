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
    setBannerTitle(title);
    setBannerBody(body);
  }, []);

  const handleBadgeUpdate = useCallback(() => {
    badgeUpdateCallback();
  }, []);

  const handleBannerHide = useCallback(() => {
    setBannerTitle(null);
    setBannerBody("");
  }, []);

  const handleBannerPress = useCallback(() => {
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
        initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
      } 
    };

    fetchSessionAndStartRealtime();
  }, [handleBannerNotify, handleBadgeUpdate]);

  useEffect(() => {
  const initSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      return;
    }

    if (session) {
      supabase.auth.startAutoRefresh();
      initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
    } else {
      supabase.auth.stopAutoRefresh();
    }
  };

  initSession();

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      supabase.auth.startAutoRefresh();
      initRealtimeNotifications(handleBannerNotify, handleBadgeUpdate);
    } else {
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
