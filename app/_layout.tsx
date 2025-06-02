import { SplashScreen, Stack } from "expo-router";
import { AdoptionProfileProvider } from "../context/AdoptionProfileContext";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Pushmeldingen import
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/lib/notificationSetup";
import { supabase } from "@/lib/supabase";

export default function RootLayout() {

  console.log("Layout geladen");

  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMonoRegular.ttf"),
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  //push meldingen
  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | null) => {
      console.log("Expo Push Token:", token);
    });

    const channel = supabase
      .channel("global_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const { summary } = payload.new;

          Notifications.scheduleNotificationAsync({
            content: {
              title: "Je hond heeft je nodig!",
              body: summary.replace(/\{name\}/g, "je hond"),
              sound: "default", //voor geluid
              data: { screen: "dogStart", petId: payload.new.pet_id }, // navigeren naar juiste pagina
            },
            trigger: null,
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);


  if (!loaded) return null;


  return (
    <AdoptionProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar />
    </AdoptionProfileProvider>
  );
}
