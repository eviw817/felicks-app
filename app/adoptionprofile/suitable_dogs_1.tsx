// app/adoptionprofile/suitable_dogs_1.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function SuitableDogsScreen() {
  const router = useRouter();
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
      let totalCriteria = 0;
      let reasons: string[] = [];
      let differences: string[] = [];

      // Grootte
      if (profile.preferred_size && dog.size) {
        totalCriteria++;
        if (dog.size === profile.preferred_size) {
          score++;
          reasons.push("Grootte komt overeen");
        } else {
          differences.push(
            `Grootte verschilt (gebruiker: ${profile.preferred_size}, hond: ${dog.size})`
          );
        }
      }

      // Activiteitsniveau
      if (profile.activity_level && dog.activity_level) {
        totalCriteria++;
        if (dog.activity_level === profile.activity_level) {
          score++;
          reasons.push("Activiteitsniveau komt overeen");
        } else {
          differences.push(
            `Activiteitsniveau verschilt (gebruiker: ${profile.activity_level}, hond: ${dog.activity_level})`
          );
        }
      }

      // Kindvriendelijkheid
      if (profile.has_children) {
        if (
          profile.children_ages?.length > 0 &&
          (dog.child_friendly_under_6 || dog.child_friendly_over_6)
        ) {
          totalCriteria++;
          const goodWithKids =
            (profile.children_ages.some((age: number) => age < 6) &&
              dog.child_friendly_under_6) ||
            (profile.children_ages.some((age: number) => age >= 6) &&
              dog.child_friendly_over_6);
          if (goodWithKids) {
            score++;
            reasons.push("Kindvriendelijk");
          } else {
            differences.push(
              "Hond is niet geschikt voor alle leeftijden van kinderen"
            );
          }
        }
      }

      // Socialisatie met honden
      if (profile.has_other_pets && profile.other_pets?.includes("hond")) {
        totalCriteria++;
        if (dog.social_with_dogs) {
          score++;
          reasons.push("Sociaal met andere honden");
        } else {
          differences.push("Hond is niet sociaal met andere honden");
        }
      }

      // Tuin
      if (dog.needs_garden !== null && profile.has_garden !== null) {
        totalCriteria++;
        if (dog.needs_garden && profile.has_garden) {
          score++;
          reasons.push("Heeft tuin nodig en gebruiker heeft tuin");
        } else {
          differences.push(
            "Hond heeft tuin nodig maar gebruiker heeft geen tuin"
          );
        }
      }

      // Zindelijkheid
      if (
        profile.preferences?.includes("zindelijk") &&
        dog.house_trained !== null
      ) {
        totalCriteria++;
        if (dog.house_trained) {
          score++;
          reasons.push("Zindelijkheidsvoorkeur matched");
        } else {
          differences.push("Hond is niet zindelijk zoals voorkeur");
        }
      }

      // Alleen blijven
      if (dog.can_stay_alone !== null) {
        totalCriteria++;
        if (dog.can_stay_alone) {
          score++;
          reasons.push("Hond kan alleen blijven");
        } else {
          differences.push("Hond kan niet alleen blijven");
        }
      }

      // Vervoerbaar in auto
      if (dog.can_be_transported_in_car !== null) {
        totalCriteria++;
        if (dog.can_be_transported_in_car) {
          score++;
          reasons.push("Kan mee in de auto");
        } else {
          differences.push("Hond kan niet mee in de auto");
        }
      }

      // Hypoallergeen
      if (profile.preferences?.includes("hypoallergeen")) {
        totalCriteria++;
        if (dog.hypoallergenic) {
          score++;
          reasons.push("Hypoallergeen zoals voorkeur");
        } else {
          differences.push("Hond is niet hypoallergeen");
        }
      }

      // Ras voorkeur
      if (profile.breed_pref && dog.breed) {
        totalCriteria++;
        if (dog.breed.toLowerCase() === profile.breed_pref.toLowerCase()) {
          score++;
          reasons.push("Rasvoorkeur matched");
        } else {
          differences.push(
            `Ras verschilt (gebruiker: ${profile.breed_pref}, hond: ${dog.breed})`
          );
        }
      }

      // Leeftijd voorkeur
      if (profile.preferred_age && dog.birthdate) {
        totalCriteria++;
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
        } else {
          differences.push(
            `Leeftijd verschilt (gebruiker: ${profile.preferred_age}, hond: ${ageInMonths} maanden)`
          );
        }
      }

      const percentage =
        totalCriteria > 0 ? Math.round((score / totalCriteria) * 100) : 0;

      return {
        dog,
        score,
        percentage,
        reasons,
        differences,
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
      <Text style={styles.title}>Geschikte honden</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#183A36" />
      ) : matches.length === 0 ? (
        <Text style={styles.subtitle}>Geen geschikte honden gevonden.</Text>
      ) : (
        matches.map((match, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>{match.dog.name}</Text>
            <Text style={styles.score}>
              Match Score: {match.score} / 12 ({match.percentage}%)
            </Text>
            <Text style={styles.reasons}>Overeenkomsten:</Text>
            {match.reasons.map((reason: string, idx: number) => (
              <Text key={idx} style={styles.reason}>
                - {reason}
              </Text>
            ))}
            <Text style={styles.reasons}>Verschillen:</Text>
            {match.differences.map((difference: string, idx: number) => (
              <Text key={idx} style={styles.difference}>
                - {difference}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "./dog_info",
                  params: { id: match.dog.id },
                })
              }
            >
              <Text style={styles.buttonText}>Bekijk hond</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FDFCF9",
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
  reasons: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#183A36",
  },
  reason: {
    fontSize: 14,
    color: "#183A36",
  },
  difference: {
    fontSize: 14,
    color: "#FF4C4C", // Verschillen in een andere kleur
  },
  button: {
    marginTop: 10,
    backgroundColor: "#97B8A5",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#183A36",
    fontWeight: "bold",
    fontSize: 14,
  },
});
