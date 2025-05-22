// app/adoptionprofile/test/testAdoptionProfile.tsx

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../../../lib/supabase";

export default function TestAdoptionProfile() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMatches() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Fout bij ophalen gebruiker:", userError?.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("adoption_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Fout bij ophalen profiel:", profileError?.message);
      setLoading(false);
      return;
    }

    const { data: allDogs, error: dogsError } = await supabase
      .from("adoption_dogs")
      .select("*");

    if (dogsError || !allDogs) {
      console.error("Fout bij ophalen honden:", dogsError?.message);
      setLoading(false);
      return;
    }

    const dogMatches = allDogs.map((dog) => {
      let score = 0;
      let totalCriteria = 12;
      let reasons: string[] = [];

      // Grootte
      if (dog.size === profile.preferred_size) {
        score++;
        reasons.push("Grootte komt overeen");
      }

      // Activiteitsniveau
      if (dog.activity_level === profile.activity_level) {
        score++;
        reasons.push("Activiteitsniveau komt overeen");
      }

      // Kindvriendelijkheid
      if (profile.has_children) {
        const goodWithKids =
          (profile.children_ages.some((age: number) => age < 6) &&
            dog.child_friendly_under_6) ||
          (profile.children_ages.some((age: number) => age >= 6) &&
            dog.child_friendly_over_6);
        if (goodWithKids) {
          score++;
          reasons.push("Kindvriendelijk");
        }
      }

      // Socialisatie met honden
      if (profile.has_other_pets && profile.other_pets.includes("hond")) {
        if (dog.social_with_dogs) {
          score++;
          reasons.push("Sociaal met andere honden");
        }
      }

      // Tuin
      if (dog.needs_garden && profile.has_garden) {
        score++;
        reasons.push("Heeft tuin nodig en gebruiker heeft tuin");
      }

      // Zindelijkheid
      if (profile.preferences?.includes("zindelijk") && dog.house_trained) {
        score++;
        reasons.push("Zindelijkheidsvoorkeur matched");
      }

      // Alleen blijven
      if (dog.can_stay_alone) {
        score++;
        reasons.push("Hond kan alleen blijven");
      }

      // Vervoerbaar in auto
      if (dog.can_be_transported_in_car) {
        score++;
        reasons.push("Kan mee in de auto");
      }

      // Hypoallergeen
      if (
        profile.preferences?.includes("hypoallergeen") &&
        dog.hypoallergenic
      ) {
        score++;
        reasons.push("Hypoallergeen zoals voorkeur");
      }

      // Ras voorkeur
      if (
        profile.breed_pref &&
        dog.breed &&
        dog.breed.toLowerCase() === profile.breed_pref.toLowerCase()
      ) {
        score++;
        reasons.push("Rasvoorkeur matched");
      }

      // Leeftijd voorkeur (pup of volwassen)
      if (profile.preferred_age) {
        const today = new Date();
        const birthdate = new Date(dog.birthdate);
        const ageInMonths =
          (today.getFullYear() - birthdate.getFullYear()) * 12 +
          (today.getMonth() - birthdate.getMonth());

        if (profile.preferred_age === "pup" && ageInMonths <= 12) {
          score++;
          reasons.push("Leeftijd pup matched");
        } else if (profile.preferred_age === "volwassen" && ageInMonths > 12) {
          score++;
          reasons.push("Leeftijd volwassen matched");
        }
      }

      const percentage = Math.round((score / totalCriteria) * 100);

      return {
        dog,
        score,
        percentage,
        reasons,
      };
    });

    const sortedMatches = dogMatches
      .filter((match) => match.percentage >= 50)
      .sort((a, b) => b.percentage - a.percentage);

    setMatches(sortedMatches);
    setLoading(false);
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gevonden Matches</Text>
      {loading ? (
        <Text style={styles.subtitle}>Laden...</Text>
      ) : matches.length === 0 ? (
        <Text style={styles.subtitle}>Geen honden gevonden die matchen.</Text>
      ) : (
        matches.map((match, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>{match.dog.name}</Text>
            <Text style={styles.score}>
              Match Score: {match.score} / 12 ({match.percentage}%)
            </Text>
            {match.reasons.map((reason: string, idx: number) => (
              <Text key={idx} style={styles.reason}>
                - {reason}
              </Text>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFDF9",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#183A36",
  },
  subtitle: {
    fontSize: 16,
    color: "#183A36",
    marginBottom: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#E6F0EA",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#183A36",
  },
  score: {
    fontSize: 16,
    marginBottom: 10,
    color: "#183A36",
  },
  reason: {
    fontSize: 14,
    color: "#183A36",
  },
});
