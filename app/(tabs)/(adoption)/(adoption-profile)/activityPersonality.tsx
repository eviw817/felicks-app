"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

export default function ActivityPersonality() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    activity: "",
    personality: "",
  });

  const [fontsLoaded] = useFonts({
    "NunitoRegular": require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    "NunitoBold": require("@/assets/fonts/Nunito/NunitoBold.ttf"),
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("adoption_profiles")
        .select("activity_level, personality")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setAnswers({
          activity: data.activity_level || "",
          personality: data.personality || "",
        });
      }

      if (error) {
        console.warn("⚠️ Ophalen bestaande antwoorden mislukt:", error.message);
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "activity" | "personality",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      activity_level: newAnswers.activity,
      personality: newAnswers.personality,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("❌ DB save error:", error.message);
    else console.log("✅ Opgeslagen:", payload);
  };

  const canNext = answers.activity !== "" && answers.personality !== "";

  const activityOptions = [
    { label: "Ik hou van rust en korte wandelingen in de buurt", value: "low" },
    {
      label: "Ik wandel graag elke dag, soms een stevige tocht",
      value: "medium",
    },
    {
      label: "Ik ben altijd in beweging – hiken, sporten, buiten zijn!",
      value: "high",
    },
  ];

  const personalityOptions = [
    {
      label: "Gezelligheid en rust – een trouwe metgezel in huis",
      value: "companion",
    },
    { label: "Een vrolijk maatje voor wandelingen en spel", value: "playmate" },
    {
      label: "Een loyale hond die ook goed waakt als dat nodig is",
      value: "guard",
    },
    {
      label: "Een slimme hond om mee te trainen en dingen aan te leren",
      value: "trainable",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activiteit & persoonlijkheid</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill4} />
      </View>

      <Text style={styles.question}>Hoe actief ben je?</Text>
      {activityOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("activity", opt.value)}
        >
          <RadioButton selected={answers.activity === opt.value} />
          <Text style={styles.answerText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.question, { marginTop: 32 }]}>
        Wat zoek je in een hond?
      </Text>
      {personalityOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("personality", opt.value)}
        >
          <RadioButton selected={answers.personality === opt.value} />
          <Text style={styles.answerText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/sound_behavior")}
        disabled={!canNext}
      >
        <Text style={styles.buttonText}>VOLGENDE</Text>
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
  headerContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginBottom: 16,
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
  progressBar: {
    width: "100%",
    height: 6,
    borderColor: "#FFD87E",
    borderWidth: 1,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill4: {
    width: "57.14%",
    height: "100%",
    backgroundColor: "#FFD87E",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  question: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#183A36",
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#97B8A5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#97B8A5",
  },
  answerText: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#183A36",
    flex: 1,
  },
  button: {
    marginTop: 40,
    backgroundColor: "#97B8A5",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#183A36",
  },
});
