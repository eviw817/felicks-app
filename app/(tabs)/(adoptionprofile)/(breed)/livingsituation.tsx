"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BaseText from "@/components/BaseText";
import { useFonts } from "expo-font";
import { supabase } from "@/lib/supabase";

// ✅ Reusable radio button
const RadioButtonOption = ({
  selected,
  label,
  onPress,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.radioRow} onPress={onPress}>
    <View style={styles.radioOuter}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <BaseText style={styles.answerText}>{label}</BaseText>
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
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoMedium: require("@/assets/fonts/Nunito/NunitoMedium.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaRegular: require("@/assets/fonts/Sirenia/SireniaRegular.ttf"),
  });

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;
      const uid = userData.user.id;
      setUserId(uid);

      const { data } = await supabase
        .from("adoption_profiles")
        .select("living_situation, home_frequency")
        .eq("user_id", uid)
        .single();

      if (data) {
        setAnswers({
          livingSituation: data.living_situation || "",
          homeFrequency: data.home_frequency || "",
        });
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleAnswer = async (
    key: "livingSituation" | "homeFrequency",
    value: string
  ) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (!userId) return;

    await supabase.from("adoption_profiles").upsert(
      [
        {
          user_id: userId,
          living_situation: newAnswers.livingSituation,
          home_frequency: newAnswers.homeFrequency,
        },
      ],
      { onConflict: "user_id" }
    );
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
    { label: "We hebben een tuin waar de hond kan snuffelen", value: "garden" },
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <BaseText variant="title" style={styles.headerTitle}>
          Woonsituatie
        </BaseText>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <BaseText style={styles.question}>Waar woon je?</BaseText>
      {livingOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          selected={answers.livingSituation === opt.value}
          label={opt.label}
          onPress={() => handleAnswer("livingSituation", opt.value)}
        />
      ))}

      <BaseText style={[styles.question, { marginTop: 32 }]}>
        Hoe vaak ben je thuis?
      </BaseText>
      {homeOptions.map((opt) => (
        <RadioButtonOption
          key={opt.value}
          selected={answers.homeFrequency === opt.value}
          label={opt.label}
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
    backgroundColor: "#FFFDF9",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  back: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 22,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFD87E55",
    overflow: "hidden",
    marginVertical: 16,
  },
  progressFill: {
    width: "14.28%",
    height: "100%",
    backgroundColor: "#FFD87E",
  },
  question: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#183A36",
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
    fontFamily: "NunitoBold",
    fontSize: 16,
    color: "#183A36",
  },
});
