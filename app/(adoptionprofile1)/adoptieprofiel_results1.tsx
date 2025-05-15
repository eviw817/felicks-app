"use client";

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

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
  living_situation: string;
}

export default function AdoptieprofielResults() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [topMatches, setTopMatches] = useState<
    { breed: Breed; score: number }[]
  >([]);
  const [otherMatches, setOtherMatches] = useState<
    { breed: Breed; score: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prefsData } = await supabase
        .from("adoption_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setPrefs(prefsData ?? null);

      const { data: breedsData } = await supabase
        .from("dog_breeds")
        .select("*");
      setBreeds(breedsData ?? []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!prefs || breeds.length === 0) return;

    const toleranceMap: Record<string, string[]> = {
      apartment: ["house_no_garden", "garden", "lots_of_space"],
      house_no_garden: ["garden", "lots_of_space"],
      quiet: ["some", "talkative"],
      minimal: ["occasional", "daily"],
      no_hair: ["some_hair", "accept_hair"],
    };

    const softMatch = (
      pref: string,
      value: string,
      tolerance: Record<string, string[]>
    ): boolean => {
      return (
        pref === value || (tolerance[pref] && tolerance[pref].includes(value))
      );
    };

    const scored = breeds.map((breed) => {
      let score = 0;

      // Booleans
      if (prefs.experience_level === "none" && !breed.experience_required)
        score++;
      if (prefs.experience_level !== "none" && breed.experience_required)
        score++;
      if (prefs.good_with_children === breed.good_with_children) score++;
      if (prefs.good_with_pets === breed.good_with_pets) score++;

      // Exact matches
      if (prefs.preferred_size === breed.size) score++;
      if (prefs.activity_level === breed.activity_level) score++;
      if (prefs.personality_type === breed.personality_type) score++;

      // Soft matches
      if (
        softMatch(prefs.living_situation, breed.living_situation, toleranceMap)
      )
        score++;
      if (softMatch(prefs.barking, breed.barking, toleranceMap)) score++;
      if (softMatch(prefs.grooming, breed.grooming, toleranceMap)) score++;
      if (softMatch(prefs.shedding, breed.shedding, toleranceMap)) score++;

      // Garden
      if (prefs.has_garden === breed.needs_garden) score++;

      const scorePercentage = score / 12;
      return { breed, score: scorePercentage };
    });

    console.log(
      "🔍 Scores:",
      scored.map((s) => ({
        name: s.breed.name,
        score: `${Math.round(s.score * 100)}%`,
      }))
    );

    setTopMatches(scored.filter((r) => r.score >= 0.6));
    setOtherMatches(scored.filter((r) => r.score >= 0.3 && r.score < 0.6));
  }, [prefs, breeds]);

  const renderBreed = ({ item }: { item: { breed: Breed; score: number } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(adoptionprofile1)/breed/[id]",
          params: { id: item.breed.id.toString() },
        } as any)
      }
    >
      <Text style={styles.name}>{item.breed.name}</Text>
      <Text style={styles.score}>{Math.round(item.score * 100)}% match</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#97B8A5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎯 Topmatches</Text>
      {topMatches.length === 0 ? (
        <Text style={styles.empty}>Geen topmatches gevonden</Text>
      ) : (
        <FlatList
          data={topMatches}
          keyExtractor={(item) => item.breed.id.toString()}
          renderItem={renderBreed}
        />
      )}

      <Text style={[styles.title, { marginTop: 32 }]}>
        💡 Andere mogelijke matches
      </Text>
      {otherMatches.length === 0 ? (
        <Text style={styles.empty}>Geen andere matches gevonden</Text>
      ) : (
        <FlatList
          data={otherMatches}
          keyExtractor={(item) => item.breed.id.toString()}
          renderItem={renderBreed}
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#183A36",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#183A36" },
  score: { fontSize: 14, color: "#97B8A5" },
  card: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F0F5F3",
    borderRadius: 10,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#97B8A5",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  empty: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginVertical: 12,
  },
});
