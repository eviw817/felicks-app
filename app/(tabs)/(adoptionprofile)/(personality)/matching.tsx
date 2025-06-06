"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Platform,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import BaseText from "@/components/BaseText";

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
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        {/* Use BaseText component for title */}
        <BaseText variant="title" style={styles.title}>
          Jouw matches
        </BaseText>
      </View>

      {matches.length === 0 ? (
        <BaseText style={styles.noMatches}>
          Geen geschikte matches gevonden.
        </BaseText>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.dog.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/dog-detail/[id]",
                  params: { id: item.dog.id },
                })
              }
            >
              <View style={styles.cardRow}>
                <Image
                  source={
                    item.dog.images?.length
                      ? { uri: item.dog.images[0] }
                      : require("@/assets/images/logo_felicks.png")
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <BaseText style={styles.name}>{item.dog.name}</BaseText>
                  <BaseText style={styles.score}>{item.score}% match</BaseText>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.homeButtonWrapper}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/homepage")}
        >
          <BaseText style={styles.homeButtonText}>Ga naar home</BaseText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 50,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  back: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 22,
    fontFamily: "Sirenia-Regular",
    color: "#183A36",
  },
  noMatches: {
    fontSize: 16,
    textAlign: "center",
    color: "#183A36",
  },
  card: {
    backgroundColor: "#E2F0E7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  cardInfo: {
    flex: 1,
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
  homeButtonWrapper: {
    marginTop: 20,
    marginBottom: 24,
  },
  homeButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 16,
    color: "#183A36",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingHorizontal: 12,
  },
});
