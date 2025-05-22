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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

interface Dog {
  id: string;
  name: string;
  breed: string;
  birthdate: string;
  size: string;
  activity_level: string;
  child_friendly_under_6: boolean;
  child_friendly_over_6: boolean;
  house_trained: boolean;
  social_with_dogs: boolean;
  social_with_cats: boolean;
  description: string;
  images: string[];
  shelter: string;
}

export default function Matching() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<{ dog: Dog; score: number }[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prefs } = await supabase
        .from("adoption_dog_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: dogs } = await supabase.from("adoption_dogs").select("*");

      if (!prefs || !dogs) {
        setLoading(false);
        return;
      }

      const scored = await Promise.all(
        dogs.map(async (dog: Dog) => {
          let score = 0;
          let total = 0;

          if (prefs.preferred_age && prefs.preferred_age !== "geen_voorkeur") {
            total++;
            const age = getAgeCategory(dog.birthdate);
            if (prefs.preferred_age === age) score++;
          }

          if (prefs.training_level) {
            total++;
            if (prefs.training_level === "geen_voorkeur" || dog.house_trained)
              score++;
          }

          if (prefs.interaction_children) {
            total++;
            if (
              prefs.interaction_children === "niet van toepassing" ||
              dog.child_friendly_under_6 ||
              dog.child_friendly_over_6
            ) {
              score++;
            }
          }

          if (prefs.interaction_dogs) {
            total++;
            if (
              prefs.interaction_dogs === "niet van toepassing" ||
              (prefs.interaction_dogs === "goed" && dog.social_with_dogs) ||
              (prefs.interaction_dogs === "beetje" && dog.social_with_dogs)
            ) {
              score++;
            }
          }

          if (prefs.energy_preference) {
            total++;
            if (
              (prefs.energy_preference === "enthousiasme" &&
                dog.activity_level === "high") ||
              (prefs.energy_preference === "ontspanning" &&
                dog.activity_level !== "high")
            ) {
              score++;
            }
          }

          const match_score =
            total === 0 ? 0 : Math.round((score / total) * 100);

          // Debug output
          console.log(`Matchscore ${dog.name}:`, match_score);

          // Upsert match naar adoption_matches
          const { error } = await supabase.from("adoption_matches").upsert(
            {
              user_id: user.id,
              dog_id: dog.id,
              match_score,
            },
            { onConflict: "user_id,dog_id" }
          );

          if (error) {
            console.error(
              `❌ Fout bij opslaan match voor ${dog.name}:`,
              error.message
            );
          }

          return { dog, score: match_score };
        })
      );

      const filtered = scored.filter((match) => match.score >= 50);
      console.log("🐾 MATCHED DOGS:", filtered);

      setMatches(filtered.sort((a, b) => b.score - a.score));
      setLoading(false);
    })();
  }, []);

  const getAgeCategory = (birthdate: string): string => {
    const birth = new Date(birthdate);
    const now = new Date();
    const age =
      (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 1) return "puppy";
    if (age < 3) return "jong_volwassen";
    if (age < 8) return "volwassen";
    return "senior";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#97B8A5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => router.push("/homepage")}
      >
        <Ionicons name="home-outline" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Jouw matches</Text>

      {matches.length === 0 ? (
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          Geen geschikte matches gevonden.
        </Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.dog.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push(
                  `/(adoption_personality)/dog-detail/${item.dog.id}` as any
                )
              }
            >
              <Text style={styles.name}>{item.dog.name}</Text>
              <Text style={styles.score}>{item.score}% match</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  back: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#183A36",
  },
  score: {
    fontSize: 16,
    color: "#97B8A5",
  },
});
