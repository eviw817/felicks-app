"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";
import { useFonts } from "expo-font";

export default function ActivityPersonality() {
const [fontsLoaded] = useFonts({
    "NunitoRegular": require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    "NunitoBold": require("@/assets/fonts/Nunito/NunitoBold.ttf"),
  });

  if (!fontsLoaded) {
      return <View />;
    }

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    activity: "",
    personality: "",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("adoption_profiles")
        .select("activity_level, personality")
        .eq("user_id", user.id)
        .single();

      if (data) {
        console.log("✅ Profiel geladen:", data);
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

  const handleAnswer = async (
    question: "activity" | "personality",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);
    console.log("🔄 Antwoord bijgewerkt:", newAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      activity_level: newAnswers.activity,
      personality: newAnswers.personality,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert([payload], {
        onConflict: "user_id",
      });

    if (error) console.error("❌ Fout bij opslaan in DB:", error.message);
    else console.log("✅ Antwoorden opgeslagen in DB:", payload);
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

  const RadioButtonOption: React.FC<{
    selected: boolean;
    label: string;
    onPress: () => void;
  }> = ({ selected, label, onPress }) => (
    <TouchableOpacity style={styles.radioRow} onPress={onPress}>
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <BaseText style={styles.answerText}>{label}</BaseText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <BaseText variant="title" style={styles.headerTitle}>
          Activiteit & persoonlijkheid
        </BaseText>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill4} />
      </View>

      <BaseText style={styles.question}>Hoe actief ben je?</BaseText>
      {activityOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          label={opt.label}
          selected={answers.activity === opt.value}
          onPress={() => handleAnswer("activity", opt.value)}
        />
      ))}

      <BaseText style={[styles.question, { marginTop: 32 }]}>
        Wat zoek je in een hond?
      </BaseText>
      {personalityOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          label={opt.label}
          selected={answers.personality === opt.value}
          onPress={() => handleAnswer("personality", opt.value)}
        />
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/soundBehavior")}
        disabled={!canNext}
      >
        <BaseText variant="button" style={styles.buttonText}>
          VOLGENDE
        </BaseText>
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
    fontSize: 18,
    fontFamily: "NunitoBold",
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
    fontSize: 16,
    fontFamily: "NunitoRegular",
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "NunitoBold",
    color: "#183A36",
  },
});