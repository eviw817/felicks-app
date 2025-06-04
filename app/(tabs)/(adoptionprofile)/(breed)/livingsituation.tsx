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

export default function LivingSituation() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    livingSituation: "",
    homeFrequency: "",
  });

  useEffect(() => {
    (async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user?.id) return;

      const uid = userData.user.id;
      setUserId(uid);

      const { data: existingProfile, error } = await supabase
        .from("adoption_profiles")
        .select("living_situation, home_frequency")
        .eq("user_id", uid)
        .single();

      if (error) {
        console.error("❌ Fout bij ophalen profiel:", error.message);
      }

      if (existingProfile) {
        console.log("✅ Profiel geladen:", existingProfile);
        setAnswers({
          livingSituation: existingProfile.living_situation || "",
          homeFrequency: existingProfile.home_frequency || "",
        });
      }
    })();
  }, []);

  const handleAnswer = async (
    question: "livingSituation" | "homeFrequency",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);
    console.log("🔄 Antwoord bijgewerkt:", newAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      living_situation: newAnswers.livingSituation,
      home_frequency: newAnswers.homeFrequency,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert([payload], {
        onConflict: "user_id",
      });

    if (error) console.error("❌ Fout bij opslaan in DB:", error.message);
    else console.log("✅ Antwoorden opgeslagen in DB:", payload);
  };

  const canNext =
    answers.livingSituation !== "" && answers.homeFrequency !== "";

  const livingOptions = [
    {
      label: "In een gezellig appartement – knus en compact",
      value: "apartment",
    },
    {
      label: "Een huis zonder tuin, maar met wandelopties",
      value: "house_no_garden",
    },
    {
      label: "We hebben een tuin waar de hond kan snuffelen",
      value: "garden",
    },
    {
      label: "Veel ruimte, veel natuur – buiten zijn vanzelfsprekend",
      value: "nature",
    },
  ];

  const homeOptions = [
    {
      label: "Bijna altijd, ik werk thuis of ben vaak thuis",
      value: "mostly_home",
    },
    { label: "Gedeeld – soms thuis, soms weg", value: "mixed" },
    {
      label: "Vaak van huis – hond moet alleen kunnen zijn",
      value: "often_away",
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
          Woonsituatie
        </BaseText>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill1} />
      </View>

      <BaseText style={styles.question}>Waar woon je?</BaseText>
      {livingOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          label={opt.label}
          selected={answers.livingSituation === opt.value}
          onPress={() => handleAnswer("livingSituation", opt.value)}
        />
      ))}

      <BaseText style={[styles.question, { marginTop: 32 }]}>
        Hoe vaak ben je thuis?
      </BaseText>
      {homeOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          label={opt.label}
          selected={answers.homeFrequency === opt.value}
          onPress={() => handleAnswer("homeFrequency", opt.value)}
        />
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/experienceSize")}
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
    marginBottom: 16,
    height: 40,
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
  progressFill1: {
    width: "14.28%",
    height: "100%",
    backgroundColor: "#FFD87E",
  },
  question: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
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
    fontFamily: "Nunito-Regular",
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
    fontFamily: "Nunito-Bold",
    color: "#183A36",
  },
});
