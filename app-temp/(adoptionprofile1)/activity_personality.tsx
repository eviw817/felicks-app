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
import { supabase } from "../../lib/supabase";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const RadioButton: React.FC<{ selected: boolean; onPress: () => void }> = ({
  selected,
  onPress,
}) => (
  <TouchableOpacity style={styles.radioOuter} onPress={onPress}>
    {selected && <View style={styles.radioInner} />}
  </TouchableOpacity>
);

export default function ActivityPersonality() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    activity: "",
    personality: "",
  });

  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);
  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "activity" | "personality",
    value: string
  ) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    if (!userId) return;

    const payload: Record<string, any> = { user_id: userId };
    if (question === "activity") payload.activity_level = value;
    if (question === "personality") payload.personality_type = value;

    const { error } = await supabase
      .from("profiles_breed_matches")
      .upsert(payload, { onConflict: "user_id" });
    if (error) console.error("DB save error:", error.message);
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
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Activiteit & persoonlijkheid</Text>
      <View style={styles.progressBar}>
        <View style={styles.progressFill4} />
      </View>

      <Text style={styles.question}>Hoe actief ben je?</Text>
      {activityOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.activity === opt.value}
            onPress={() => handleAnswer("activity", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      <Text style={[styles.question, { marginTop: 32 }]}>
        Wat zoek je in een hond?
      </Text>
      {personalityOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.personality === opt.value}
            onPress={() => handleAnswer("personality", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
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
  back: { paddingVertical: 8 },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#183A36",
    textAlign: "center",
    marginBottom: 16,
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
    width: 12,
    height: 12,
    borderRadius: 6,
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
