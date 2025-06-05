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

// ✅ Herbruikbare radiobutton component
const RadioButtonOption: React.FC<{
  selected: boolean;
  label: string;
  onPress: () => void;
}> = ({ selected, label, onPress }) => (
  <TouchableOpacity style={styles.radioRow} onPress={onPress}>
    <View style={styles.radioOuter}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.answerText}>{label}</Text>
  </TouchableOpacity>
);

export default function LivingSituation() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    livingSituation: "",
    homeFrequency: "",
  });

  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    "Nunito-Medium": require("@/assets/fonts/Nunito/NunitoMedium.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    "Sirenia-Regular": require("@/assets/fonts/Sirenia/SireniaRegular.ttf"),
  });

  useEffect(() => {
    (async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user?.id) return;

      const uid = userData.user.id;
      setUserId(uid);

      const { data: existingProfile } = await supabase
        .from("adoption_profiles")
        .select("living_situation, home_frequency")
        .eq("user_id", uid)
        .single();

      if (existingProfile) {
        setAnswers({
          livingSituation: existingProfile.living_situation || "",
          homeFrequency: existingProfile.home_frequency || "",
        });
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "livingSituation" | "homeFrequency",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      living_situation: newAnswers.livingSituation,
      home_frequency: newAnswers.homeFrequency,
    };

    await supabase.from("adoption_profiles").upsert([payload], {
      onConflict: "user_id",
    });
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header met pijl en titel gecentreerd */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Woonsituatie</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill1} />
      </View>

      <Text style={styles.question}>Waar woon je?</Text>
      {livingOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          label={opt.label}
          selected={answers.livingSituation === opt.value}
          onPress={() => handleAnswer("livingSituation", opt.value)}
        />
      ))}

      <Text style={[styles.question, { marginTop: 32 }]}>
        Hoe vaak ben je thuis?
      </Text>
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
        onPress={() => router.push("/experience_size")}
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
  progressFill1: {
    width: "14.28%",
    height: "100%",
    backgroundColor: "#FFD87E",
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
