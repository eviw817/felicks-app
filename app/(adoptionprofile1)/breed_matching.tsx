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
  const [answers, setAnswers] = useState<any>(null); // Explicit type
  const [breeds, setBreeds] = useState<any[]>([]); // Explicit type

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
        const { data: fetchedAnswers, error: ansErr } = await supabase
          .from("profiles_breed_matches")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (ansErr) {
          console.error("Fout bij het ophalen van antwoorden:", ansErr);
          // fallback: ga alsnog naar results zonder matches
          router.replace("/adoptieprofiel_results");
          return;
        }

        if (!fetchedAnswers) {
          console.log("Geen antwoorden gevonden voor gebruiker:", userId);
          router.replace("/adoptieprofiel_results");
          return;
        }

        setAnswers(fetchedAnswers);
        console.log("Opgehaalde antwoorden:", fetchedAnswers); // Log de antwoorden

        // Haal alle rassen
        const { data: fetchedBreeds, error: breedErr } = await supabase
          .from("dog_breeds")
          .select("*");

        if (breedErr) {
          console.error("Fout bij het ophalen van rassen:", breedErr);
          // fallback: ga alsnog naar results zonder matches
          router.replace("/adoptieprofiel_results");
          return;
        }

        if (!fetchedBreeds) {
          console.log("Geen rassen gevonden in de database.");
          router.replace("/adoptieprofiel_results");
          return;
        }

        setBreeds(fetchedBreeds);
        console.log("Opgehaalde rassen:", fetchedBreeds.length); // Log het aantal rassen
      } catch (error) {
        console.error("Algemene fout bij het matchen:", error);
        // fallback: ga alsnog naar results zonder matches
        router.replace("/adoptieprofiel_results");
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (answers && breeds.length > 0) {
      console.log("Bezig met filteren van rassen...");
      const matched = breeds.filter((breed) => {
        const experienceMatch =
          breed.experience_level === answers.experience_level;
        const sizeMatch = breed.preferred_size === answers.preferred_size;
        const livingSituationMatch =
          breed.living_situation === answers.living_situation;
        const homeFrequencyMatch =
          breed.home_frequency === answers.home_frequency;
        const childrenMatch =
          breed.good_with_children === answers.good_with_children;
        const petsMatch = breed.good_with_pets === answers.good_with_pets;
        const activityMatch = breed.activity_level === answers.activity_level;
        const personalityMatch = breed.personality === answers.personality_type; // Let op de key: personality_type in answers
        const barkingMatch = breed.barking === answers.barking;
        const trainingMatch = breed.training === answers.training;
        const groomingMatch = breed.grooming === answers.grooming;
        const sheddingMatch = breed.shedding === answers.shedding;

        return (
          experienceMatch &&
          sizeMatch &&
          livingSituationMatch &&
          homeFrequencyMatch &&
          childrenMatch &&
          petsMatch &&
          activityMatch &&
          personalityMatch &&
          barkingMatch &&
          trainingMatch &&
          groomingMatch &&
          sheddingMatch
        );
      });

      console.log("Aantal gematchte rassen (exact):", matched.length);
      router.replace({
        pathname: "/adoptieprofiel_results1",
        params: { matches: JSON.stringify(matched) },
      });
    }
  }, [answers, breeds, router]);

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
