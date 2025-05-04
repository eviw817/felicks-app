// app/(adoptionprofile1)/AdoptieProfielLoading.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function AdoptieProfielLoading() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Haal ingelogde gebruiker op
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        // Haal antwoorden van deze gebruiker op
        const { data: answers, error: ansErr } = await supabase
          .from("profiles_breed_matches")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (ansErr || !answers)
          throw ansErr || new Error("Geen antwoorden gevonden");

        // Haal alle rassen
        const { data: breeds, error: breedErr } = await supabase
          .from("dog_breeds")
          .select("*");
        if (breedErr || !breeds)
          throw breedErr || new Error("Rassen niet gevonden");

        // Filter rassen op basis van antwoorden
        const matched = breeds.filter((breed) => {
          return (
            breed.experience_level === answers.experience_level &&
            breed.preferred_size === answers.preferred_size &&
            breed.living_situation === answers.living_situation &&
            breed.home_frequency === answers.home_frequency &&
            breed.good_with_children === answers.good_with_children &&
            breed.other_pets === answers.other_pets &&
            breed.activity_level === answers.activity_level &&
            breed.personality === answers.personality &&
            breed.barking === answers.barking &&
            breed.training === answers.training &&
            breed.grooming === answers.grooming &&
            breed.shedding === answers.shedding
          );
        });

        // Navigeer door met de lijst aan matched rassen
        router.replace({
          pathname: "/adoptieprofiel_results",
          params: { matches: JSON.stringify(matched) },
        });
      } catch (error) {
        console.error("Matchen fout:", error);
        // fallback: ga alsnog naar results zonder matches
        router.replace("/adoptieprofiel_results");
      }
    })();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Adoptieprofiel</Text>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#97B8A5" />
        <Text style={styles.loadingText}>Even geduld...</Text>
        <Text style={styles.loadingText}>We zoeken jouw perfecte match!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 50,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#183A36",
    textAlign: "center",
    marginBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#183A36",
    marginTop: 12,
    textAlign: "center",
  },
});
