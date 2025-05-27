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

// Alleen visuele radiobutton
const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

export default function GroomingCoat() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    grooming: "",
    shedding: "",
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
      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("adoption_profiles")
          .select("grooming, shedding")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error(
            "❌ Ophalen bestaande antwoorden mislukt:",
            error.message
          );
        } else if (data) {
          setAnswers({
            grooming: data.grooming || "",
            shedding: data.shedding || "",
          });
        }
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "grooming" | "shedding",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      grooming: newAnswers.grooming,
      shedding: newAnswers.shedding,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("❌ DB save error:", error.message);
  };

  const canNext = answers.grooming !== "" && answers.shedding !== "";

  const groomingOptions = [
    {
      label: "Zo weinig mogelijk – ik hou het graag praktisch",
      value: "minimal",
    },
    { label: "Af en toe borstelen? Dat hoort erbij", value: "occasional" },
    { label: "Dagelijks borstelen is voor mij qualitytime", value: "daily" },
  ];

  const sheddingOptions = [
    { label: "Ik hou m’n huis graag netjes en haarvrij", value: "no_hair" },
    {
      label: "Een beetje haar? Daar lig ik niet van wakker",
      value: "some_hair",
    },
    { label: "Ik accepteer dat het erbij hoort", value: "accept_hair" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Verzorging & vacht</Text>
      <View style={styles.progressBar}>
        <View style={styles.progressFill6} />
      </View>

      <Text style={styles.question}>Hoeveel verzorging wil je geven?</Text>
      {groomingOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("grooming", opt.value)}
        >
          <RadioButton selected={answers.grooming === opt.value} />
          <Text style={styles.answerText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.question, { marginTop: 32 }]}>
        Wat vind je van hondenhaar in huis?
      </Text>
      {sheddingOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("shedding", opt.value)}
        >
          <RadioButton selected={answers.shedding === opt.value} />
          <Text style={styles.answerText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/adoptieprofiel_results1")}
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
  progressFill6: {
    width: "85.71%",
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
