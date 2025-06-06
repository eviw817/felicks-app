import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      const session = data?.session;

      if (session) {
        // Supabase Session does not have 'created_at', but has 'expires_at' (in seconds)
        const now = Date.now();
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0; // expires_at is in seconds
        const thirtyMinutes = 30 * 60 * 1000;

        if (expiresAt - now > thirtyMinutes) {
          // Valid session with more than 30 mins left
          router.replace("/homepage");
          return;
        }
      }

      // No valid session, go to loginRegister
      router.replace("/loginRegister");
    };

    const timer = setTimeout(() => {
      checkSession();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo_felicks.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 340,
    height: 340,
    resizeMode: "contain",
  },
});
