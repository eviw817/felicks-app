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
import { Ionicons } from "@expo/vector-icons";
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
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#183A36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{breed.name}</Text>
        </View>

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

        <TouchableOpacity
          style={{
            backgroundColor: "#97B8A5",
            padding: 12,
            borderRadius: 15,
            alignItems: "center",
            marginBottom: 20,
            marginTop: 10,
          }}
          onPress={() => router.push("/(homepage)/homepage")}
        >
          <Text
            style={{
              color: "#183A36",
              fontFamily: "Nunito-Bold",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            naar home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", padding: 16 },
  headerContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginBottom: 16,
    marginTop: 25,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontFamily: "Sirenia-Regular",
    fontSize: 20,
    color: "#183A36",
    textAlign: "center",
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
