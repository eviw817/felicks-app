"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function AdoptieProfielResults() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<any>(null);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data: prefsData, error: prefsErr } = await supabase
        .from("adoption_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (prefsErr || !prefsData) {
        console.error("❌ Fout bij ophalen voorkeuren:", prefsErr?.message);
        return;
      }

      setPrefs(prefsData);

      const { data: breedData, error: breedErr } = await supabase
        .from("dog_breeds")
        .select("*");

      if (breedErr || !breedData) {
        console.error("❌ Fout bij ophalen rassen:", breedErr?.message);
        return;
      }

      setBreeds(breedData);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!prefs || breeds.length === 0) return;

    const criteria = [
      "preferred_size",
      "activity_level",
      "good_with_children",
      "good_with_pets",
      "shedding",
      "barking",
      "training",
      "grooming",
      "personality_type",
      "can_be_alone",
      "experience_level",
    ];

    const scored = breeds.map((breed) => {
      let matchCount = 0;
      let totalCriteria = 0;

      criteria.forEach((field) => {
        if (prefs[field] !== null && prefs[field] !== undefined) {
          totalCriteria++;
          const userVal = prefs[field];
          const breedVal = breed[field];

          if (
            typeof userVal === "boolean" &&
            typeof breedVal === "boolean" &&
            userVal === breedVal
          ) {
            matchCount++;
          } else if (
            typeof userVal === "string" &&
            typeof breedVal === "string" &&
            userVal.toLowerCase() === breedVal.toLowerCase()
          ) {
            matchCount++;
          }
        }
      });

      const score = totalCriteria > 0 ? matchCount / totalCriteria : 0;
      return { ...breed, score };
    });

    const filtered = scored
      .filter((item) => item.score >= 0.3)
      .sort((a, b) => b.score - a.score);

    setMatches(filtered);
  }, [prefs, breeds]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#97B8A5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jouw hondenmatches</Text>

      {matches.length === 0 ? (
        <Text style={styles.subtitle}>Geen honden gevonden</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>
                Matchingscore: {Math.round(item.score * 100)}%
              </Text>
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
  subtitle: { fontSize: 16, textAlign: "center", marginTop: 50 },
  card: { marginBottom: 16, alignItems: "center" },
  name: { fontSize: 16, fontWeight: "600" },
  score: { fontSize: 14, color: "#888" },
  button: {
    marginTop: 24,
    backgroundColor: "#97B8A5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
