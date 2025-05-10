import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { supabase } from "../../../lib/supabase";
import { Session } from "@supabase/supabase-js";

function StartScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // Check of de gebruiker ingelogd is, zo niet: stuur naar loginpagina
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        router.replace("/login/login"); // Redirect als er geen sessie is
      }
    };

    fetchSession();

    // Luister naar veranderingen in de authenticatie status
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          router.replace("/login/login"); // Als de gebruiker uitlogt, direct naar loginpagina
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login_register"); // Stuur gebruiker direct terug naar loginpagina
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} className="semibold">
        Welkom bij Felicks!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => await signOut()}
      >
        <Text style={styles.buttonText}>Uitloggen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFDF9",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#183A36",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StartScreen;
