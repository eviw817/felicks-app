// app/(adoptionprofile1)/grooming_coat.tsx
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

// Custom radio-button component
const RadioButton: React.FC<{ selected: boolean; onPress: () => void }> = ({
  selected,
  onPress,
}) => (
  <TouchableOpacity style={styles.radioOuter} onPress={onPress}>
    {selected && <View style={styles.radioInner} />}
  </TouchableOpacity>
);

export default function GroomingCoat() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    grooming: "",
    shedding: "",
  });

  // 1. Fonts laden
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  // 2. User fetchen
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  // 3. Wacht op fonts
  if (!fontsLoaded) return null;

  // Antwoorden opslaan + upserten met juiste kolomnamen
  const handleAnswer = async (
    question: "grooming" | "shedding",
    value: string
  ) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    if (!userId) return;

    // payload bouwen
    const payload: Record<string, any> = { user_id: userId };
    if (question === "grooming") payload.grooming = value;
    else payload.shedding = value;

    const { error } = await supabase
      .from("profiles_breed_matches")
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("DB save error:", error.message);
  };

  const canNext = answers.grooming !== "" && answers.shedding !== "";

  const groomingOptions = [
    {
      label: "Zo weinig mogelijk – ik hou het graag praktisch",
      value: "minimal",
    },
    { label: "Af en toe borstelen? Dat hoort erbij", value: "occasional" },
    {
      label: "Dagelijks borstelen is voor mij qualitytime",
      value: "daily",
    },
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
      {/* Back button */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Verzorging & vacht</Text>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill6} />
      </View>

      {/* Vraag: Grooming */}
      <Text style={styles.question}>Hoeveel verzorging wil je geven?</Text>
      {groomingOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.grooming === opt.value}
            onPress={() => handleAnswer("grooming", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      {/* Vraag: Shedding */}
      <Text style={[styles.question, { marginTop: 32 }]}>
        Wat vind je van hondenhaar in huis?
      </Text>
      {sheddingOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.shedding === opt.value}
            onPress={() => handleAnswer("shedding", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      {/* Next button */}
      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/breed_matching")}
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
  back: {
    paddingVertical: 8,
  },
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
    backgroundColor: "transparent",
    borderColor: "#FFD87E",
    borderWidth: 1,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill6: {
    width: "85.71%", // 6 van 7 stappen
    height: "100%",
    backgroundColor: "#FFD87E",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  question: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#183A36",
    alignSelf: "flex-start",
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
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#183A36",
  },
});
