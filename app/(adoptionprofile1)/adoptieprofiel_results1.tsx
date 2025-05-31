"use client";

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

interface Prefs {
  living_situation: string;
  home_frequency: string;
  experience_level: string;
  preferred_size: string;
  good_with_children: "none" | "teens" | "young";
  good_with_pets: "firstPet" | "cats" | "dogs";
  activity_level: string;
  personality_type: string;
  barking: string;
  training: string;
  grooming: string;
  shedding: string;
  has_garden: boolean;
  character: string;
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
  can_be_alone: boolean;
  character: string;
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

    const scored = breeds.map((breed) => {
      let score = 0;
      let maxScore = 0;

      maxScore += 1;
      if (prefs.preferred_size === breed.size) score += 1;

      maxScore += 1;
      if (prefs.activity_level === breed.activity_level) {
        score += 1;
      } else if (
        prefs.activity_level === "high" &&
        ["medium", "low"].includes(breed.activity_level)
      ) {
        score += 0.5;
      } else if (
        prefs.activity_level === "medium" &&
        breed.activity_level === "low"
      ) {
        score += 0.5;
      }

      maxScore += 1.5;
      if (prefs.good_with_children === "none") {
        score += 1.5;
      } else if (breed.good_with_children) {
        score += 1.5;
      }

      maxScore += 1;
      if (prefs.good_with_pets === "firstPet") {
        score += 1;
      } else if (breed.good_with_pets) {
        score += 1;
      }

      maxScore += 1;
      const softPersonality: Record<string, string[]> = {
        guard: ["trainable", "companion"],
        playmate: ["companion"],
        trainable: ["playmate"],
        companion: ["playmate"],
      };
      if (prefs.personality_type === breed.personality_type) {
        score += 1;
      } else if (
        softPersonality[prefs.personality_type]?.includes(
          breed.personality_type
        )
      ) {
        score += 0.5;
      }

      maxScore += 1;
      const barkingRules: Record<string, string[]> = {
        quiet: ["quiet"],
        some: ["quiet", "some"],
        talkative: ["quiet", "some", "talkative"],
      };
      if (barkingRules[prefs.barking]?.includes(breed.barking)) score += 1;

      maxScore += 1;
      if (prefs.training === breed.training) score += 1;

      maxScore += 1;
      const groomingRules: Record<string, string[]> = {
        minimal: ["minimal"],
        occasional: ["minimal", "occasional"],
        daily: ["minimal", "occasional", "daily"],
      };
      if (groomingRules[prefs.grooming]?.includes(breed.grooming)) score += 1;

      maxScore += 0.5;
      const sheddingRules: Record<string, string[]> = {
        no_hair: ["no_hair"],
        some_hair: ["no_hair", "some_hair"],
        accept_hair: ["no_hair", "some_hair", "accept_hair"],
      };
      if (sheddingRules[prefs.shedding]?.includes(breed.shedding)) score += 0.5;

      maxScore += 1;
      if (
        !breed.needs_garden ||
        !["appartement", "huisZonderTuin"].includes(prefs.living_situation)
      ) {
        score += 1;
      }

      maxScore += 1.5;
      if (prefs.home_frequency === "vaakWeg") {
        if (breed.can_be_alone === true) score += 1.5;
      } else {
        score += 1.5;
      }

      maxScore += 1.5;
      if (prefs.experience_level === "none" && !breed.experience_required) {
        score += 1.5;
      } else if (prefs.experience_level !== "none") {
        score += 1.5;
      }

      maxScore += 0.5;
      if (prefs.character === breed.character) {
        score += 0.5;
      }

      const matchScore = maxScore > 0 ? score / maxScore : 0;
      return { breed, score: matchScore };
    });

    setTopMatches(
      scored.filter((r) => r.score >= 0.6).sort((a, b) => b.score - a.score)
    );
    setOtherMatches(
      scored
        .filter((r) => r.score >= 0.3 && r.score < 0.6)
        .sort((a, b) => b.score - a.score)
    );
  }, [prefs, breeds]);

  const renderBreed = (item: { breed: Breed; score: number }) => (
    <TouchableOpacity
      key={item.breed.id}
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
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#183A36" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>🎯 Topmatches</Text>
        </View>
        <View style={styles.headerSide} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {topMatches.length === 0 ? (
          <Text style={styles.empty}>Geen topmatches gevonden</Text>
        ) : (
          topMatches.map(renderBreed)
        )}

        <Text style={[styles.title, { marginTop: 32 }]}>
          💡 Andere mogelijke matches
        </Text>
        {otherMatches.length === 0 ? (
          <Text style={styles.empty}>Geen andere matches gevonden</Text>
        ) : (
          otherMatches.map(renderBreed)
        )}

        <TouchableOpacity
          onPress={() => router.push("/homepage")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Naar Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 16,
  },
  headerSide: {
    width: 40,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "Sirenia-Regular",
    fontSize: 20,
    color: "#183A36",
    textAlign: "center",
    marginBottom: 10,
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
    marginTop: 40,
    backgroundColor: "#97B8A5",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#183A36",
    textTransform: "uppercase",
  },
  empty: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginVertical: 12,
  },
});
