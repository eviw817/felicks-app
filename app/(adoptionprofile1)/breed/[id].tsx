"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../../lib/supabase";

export default function BreedDetail() {
  const { id } = useLocalSearchParams();
  const [breed, setBreed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data, error } = await supabase
        .from("dog_breeds")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Fout bij ophalen rasdetails:", error.message);
      } else {
        setBreed(data);
      }

      setLoading(false);
    })();
  }, [id]);

  if (loading || !breed) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#97B8A5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>{breed.name}</Text>

        <Text style={styles.label}>🐾 Karakter</Text>
        <Text style={styles.text}>{breed.character}</Text>

        <Text style={styles.label}>⚠️ Aandachtspunten</Text>
        {breed.attention_points?.map((point: string, index: number) => (
          <Text key={index} style={styles.text}>
            • {point}
          </Text>
        ))}

        <Text style={styles.label}>🧍 Geschikte eigenaar</Text>
        <Text style={styles.text}>{breed.suitable_owner}</Text>

        <Text style={styles.label}>🩺 Gezondheid</Text>
        <Text style={styles.text}>{breed.health}</Text>

        <Text style={styles.label}>🛁 Verzorging</Text>
        <Text style={styles.text}>{breed.care}</Text>

        <Text style={styles.label}>👶 Kinderen</Text>
        <Text style={styles.text}>{breed.children_info}</Text>

        <Text style={styles.label}>🐕 Andere dieren</Text>
        <Text style={styles.text}>{breed.pets_info}</Text>

        <Text style={styles.label}>🔍 Profielvergelijking</Text>
        <Text style={styles.text}>{breed.profile_match_summary}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Terug</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
    color: "#183A36",
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#97B8A5",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
