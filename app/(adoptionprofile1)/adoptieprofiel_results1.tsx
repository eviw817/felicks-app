"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

interface Prefs {
  living_situation: string;
  home_frequency: string;
  experience_level: string;
  preferred_size: string;
  good_with_children: boolean;
  good_with_pets: boolean;
  activity_level: string;
  personality_type: string;
  barking: string;
  training: string;
  grooming: string;
  shedding: string;
  has_garden: boolean;
}

interface Breed {
  id: number;
  name: string;
  image_url?: string;
  size: string;
  activity_level: string;
  good_with_children: boolean;
  good_with_pets: boolean;
  shedding: string;
  barking: string;
  training: string;
  grooming: string;
  needs_garden: boolean;
  experience_required: boolean;
  personality_type: string;
  can_be_alone: string;
}

export default function AdoptieProfielResults() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [matches, setMatches] = useState<{ breed: Breed; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from("adoption_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!profile || error) {
        console.warn("⚠️ Geen profielvoorkeuren gevonden.");
        setLoading(false);
        return;
      }

      setPrefs(profile as Prefs);

      const { data: breedData, error: bErr } = await supabase
        .from("dog_breeds")
        .select("*");

      if (!breedData || bErr) {
        console.error("❌ Error fetching breeds:", bErr);
        setLoading(false);
        return;
      }

      setBreeds(breedData);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!prefs || breeds.length === 0 || !userId) return;

    const criteria: {
      pref: keyof Prefs;
      breed: keyof Breed;
      type: "equal" | "bool";
    }[] = [
      { pref: "experience_level", breed: "experience_required", type: "equal" },
      { pref: "preferred_size", breed: "size", type: "equal" },
      { pref: "good_with_children", breed: "good_with_children", type: "bool" },
      { pref: "good_with_pets", breed: "good_with_pets", type: "bool" },
      { pref: "activity_level", breed: "activity_level", type: "equal" },
      { pref: "barking", breed: "barking", type: "equal" },
      { pref: "training", breed: "training", type: "equal" },
      { pref: "grooming", breed: "grooming", type: "equal" },
      { pref: "shedding", breed: "shedding", type: "equal" },
      { pref: "has_garden", breed: "needs_garden", type: "bool" },
    ];

    const scored = breeds.map((breed) => {
      let matchCount = 0;
      criteria.forEach((c) => {
        const pv = prefs[c.pref];
        const bv = breed[c.breed];
        if (c.type === "bool") {
          if (Boolean(pv) === Boolean(bv)) matchCount++;
        } else {
          if (pv === bv) matchCount++;
        }
      });
      return { ...breed, score: matchCount / criteria.length };
    });

    const filtered = scored.filter((r) => r.score >= 0.6);
    setMatches(filtered.map((r) => ({ breed: r, score: r.score })));

    // ✅ Save to DB
    const saveMatches = async () => {
      const matchPayload = filtered.map((r) => ({
        user_id: userId,
        breed_id: r.id,
        match_score: Number((r.score * 100).toFixed(2)),
      }));

      if (matchPayload.length > 0) {
        const { error } = await supabase
          .from("profiles_breed_matches")
          .upsert(matchPayload, { onConflict: "user_id,breed_id" });
        if (error) console.error("❌ Error saving matches:", error.message);
      }
    };

    saveMatches();
  }, [prefs, breeds, userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#97B8A5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Jouw matches</Text>
      {matches.length === 0 ? (
        <Text style={styles.noMatch}>Geen geschikte honden gevonden.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.breed.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.breed.name}</Text>
              <Text style={styles.score}>
                Matchscore: {Math.round(item.score * 100)}%
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", padding: 20 },
  back: { paddingVertical: 8 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 16,
  },
  noMatch: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 4,
  },
  score: {
    fontSize: 14,
    color: "#97B8A5",
  },
});
