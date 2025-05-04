// app/(adoptionprofile1)/adoptieprofiel_results.tsx
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
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

type Prefs = {
  user_id: string;
  living_situation: string;
  home_frequency: string;
  experience: boolean;
  preferred_size: string;
  good_with_children: boolean;
  good_with_pets: boolean;
  activity_level: string;
  personality: string;
  barking: string;
  training: string;
  grooming: string;
  shedding: string;
  has_garden: boolean;
};

type Breed = {
  id: number;
  name: string;
  image_url: string;
  living_situation: string;
  home_frequency: string;
  experience_required: boolean;
  size_category: string;
  good_with_children: boolean;
  good_with_pets: boolean;
  activity_level: string;
  personality: string;
  barking: string;
  training: string;
  grooming: string;
  shedding: string;
  needs_garden: boolean;
};

export default function AdoptieProfielResults() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [matches, setMatches] = useState<{ breed: Breed; score: number }[]>([]);

  // 1) haal voorkeuren + rassen op
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // voorkeuren
      const { data: p, error: perr } = await supabase
        .from("profiles_breed_matches")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (perr || !p) {
        console.error("Error fetching prefs:", perr);
        return;
      }
      setPrefs(p as Prefs);

      // alle rassen
      const { data: b, error: berr } = await supabase
        .from("dog_breeds")
        .select("*");
      if (berr || !b) {
        console.error("Error fetching breeds:", berr);
        return;
      }
      setBreeds(b as Breed[]);
    })();
  }, []);

  // 2) zodra prefs + breeds geladen: bereken score en filter ≥ 60%
  useEffect(() => {
    if (!prefs || breeds.length === 0) return;

    const criteria: {
      prefKey: keyof Prefs;
      breedKey: keyof Breed;
      type: "equal" | "bool";
    }[] = [
      {
        prefKey: "living_situation",
        breedKey: "living_situation",
        type: "equal",
      },
      { prefKey: "home_frequency", breedKey: "home_frequency", type: "equal" },
      { prefKey: "experience", breedKey: "experience_required", type: "bool" },
      { prefKey: "preferred_size", breedKey: "size_category", type: "equal" },
      {
        prefKey: "good_with_children",
        breedKey: "good_with_children",
        type: "bool",
      },
      { prefKey: "good_with_pets", breedKey: "good_with_pets", type: "bool" },
      { prefKey: "activity_level", breedKey: "activity_level", type: "equal" },
      { prefKey: "personality", breedKey: "personality", type: "equal" },
      { prefKey: "barking", breedKey: "barking", type: "equal" },
      { prefKey: "training", breedKey: "training", type: "equal" },
      { prefKey: "grooming", breedKey: "grooming", type: "equal" },
      { prefKey: "shedding", breedKey: "shedding", type: "equal" },
      { prefKey: "has_garden", breedKey: "needs_garden", type: "bool" },
    ];

    const scored = breeds.map((breed) => {
      let matchCount = 0;
      criteria.forEach((c) => {
        const pv = prefs[c.prefKey];
        const bv = breed[c.breedKey];
        if (c.type === "bool") {
          if (Boolean(pv) === Boolean(bv)) matchCount++;
        } else {
          if (pv === bv) matchCount++;
        }
      });
      return { breed, score: matchCount / criteria.length };
    });

    const filtered = scored
      .filter((r) => r.score >= 0.6)
      .sort((a, b) => b.score - a.score);

    setMatches(filtered);
  }, [prefs, breeds]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => router.push("/startpage/startpage")}
      >
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Geschikte honden</Text>
      <Text style={styles.subtitle}>
        Alleen rassen met ≥ 60% match op jouw profiel
      </Text>

      {matches.length === 0 ? (
        <Text style={styles.noMatch}>Geen rassen boven de 60% gevonden.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.breed.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.breed.image_url }}
                style={styles.image}
              />
              <Text style={styles.breedName}>{item.breed.name}</Text>
              <Text style={styles.score}>{Math.round(item.score * 100)}%</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/startpage/startpage")}
      >
        <Text style={styles.buttonText}>NAAR HOME</Text>
      </TouchableOpacity>
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
  back: { paddingVertical: 8 },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#183A36",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#183A36",
    textAlign: "center",
    marginBottom: 12,
  },
  noMatch: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#183A36",
    textAlign: "center",
    marginTop: 40,
  },
  list: {
    alignItems: "center",
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    alignItems: "center",
    margin: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  breedName: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: "#183A36",
    textAlign: "center",
  },
  score: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: "#97B8A5",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#183A36",
  },
});
