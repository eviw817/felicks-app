"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../lib/supabase";
import BaseText from "@/components/BaseText";

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
          <BaseText style={styles.headerTitle} variant="title">
            {breed.name}
          </BaseText>
        </View>

        <BaseText style={styles.label}>🐾 Karakter</BaseText>
        <BaseText style={styles.text}>{breed.character}</BaseText>

        <BaseText style={styles.label}>⚠️ Aandachtspunten</BaseText>
        {breed.attention_points?.map((point: string, index: number) => (
          <BaseText key={index} style={styles.text}>
            • {point}
          </BaseText>
        ))}

        <BaseText style={styles.label}>🧍 Geschikte eigenaar</BaseText>
        <BaseText style={styles.text}>{breed.suitable_owner}</BaseText>

        <BaseText style={styles.label}>🩺 Gezondheid</BaseText>
        <BaseText style={styles.text}>{breed.health}</BaseText>

        <BaseText style={styles.label}>🛁 Verzorging</BaseText>
        <BaseText style={styles.text}>{breed.care}</BaseText>

        <BaseText style={styles.label}>👶 Kinderen</BaseText>
        <BaseText style={styles.text}>{breed.children_info}</BaseText>

        <BaseText style={styles.label}>🐕 Andere dieren</BaseText>
        <BaseText style={styles.text}>{breed.pets_info}</BaseText>

        <BaseText style={styles.label}>🔍 Profielvergelijking</BaseText>
        <BaseText style={styles.text}>{breed.profile_match_summary}</BaseText>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(homepage)/homepage")}
        >
          <BaseText style={styles.buttonText}>NAAR HOME</BaseText>
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
  button: {
    backgroundColor: "#97B8A5",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#183A36",
    fontFamily: "Nunito-Bold",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
