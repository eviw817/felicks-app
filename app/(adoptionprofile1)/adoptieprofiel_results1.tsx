// Simple working proof-of-concept for Felicks matching

// app/(screens)/adoptieprofiel_results.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function AdoptieProfielResults() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [sizePref, setSizePref] = useState<string | null>(null);
  const [breeds, setBreeds] = useState<any[]>([]);

  // 1. Haal user op
  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) console.error("❌ User error:", error);
      if (!user) return;

      console.log("👤 Gebruiker:", user.id);
      setUserId(user.id);
    })();
  }, []);

  // 2. Haal voorkeur + rassen op
  useEffect(() => {
    if (!userId) return;

    (async () => {
      const { data: prefs, error: pErr } = await supabase
        .from("adoption_profiles")
        .select("preferred_size")
        .eq("user_id", userId)
        .maybeSingle();

      if (pErr) {
        console.error("❌ Fout bij ophalen voorkeur:", pErr);
        return;
      }

      if (!prefs || !prefs.preferred_size) {
        console.warn("⚠️ Geen voorkeur gevonden voor gebruiker:", userId);
        return;
      }

      console.log("📋 Voorkeur opgehaald:", prefs.preferred_size);
      setSizePref(prefs.preferred_size);

      const { data: allBreeds, error: bErr } = await supabase
        .from("dog_breeds")
        .select("id, name, image, size");

      if (bErr) {
        console.error("❌ Fout bij ophalen rassen:", bErr);
        return;
      }

      console.log("🐶 Aantal rassen opgehaald:", allBreeds.length);

      const filtered = allBreeds.filter(
        (b) =>
          b.size &&
          prefs.preferred_size &&
          b.size.toLowerCase() === prefs.preferred_size.toLowerCase()
      );

      console.log(
        "✅ Gefilterde rassen:",
        filtered.map((r) => r.name)
      );
      setBreeds(filtered);
    })();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jouw matches</Text>
      {!sizePref ? (
        <Text style={styles.loading}>Even geduld...</Text>
      ) : breeds.length === 0 ? (
        <Text style={styles.loading}>Geen honden gevonden</Text>
      ) : (
        <FlatList
          data={breeds}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonText}>Terug</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  loading: { fontSize: 16, textAlign: "center", marginTop: 50 },
  card: { marginBottom: 16, alignItems: "center" },
  name: { fontSize: 16, fontWeight: "600" },
  button: {
    marginTop: 24,
    backgroundColor: "#97B8A5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
