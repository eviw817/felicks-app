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

// mapt je vraag‐keys naar exact de kolomnamen in je tabel
const columnMap = {
  experience: "experience_level", // hier is je echte kolomnaam
  preferredSize: "preferred_size",
};

const RadioButton: React.FC<{ selected: boolean; onPress(): void }> = ({
  selected,
  onPress,
}) => (
  <TouchableOpacity style={styles.radioOuter} onPress={onPress}>
    {selected && <View style={styles.radioInner} />}
  </TouchableOpacity>
);

export default function ExperienceSize() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    experience: "",
    preferredSize: "",
  });

  // 1) font‐laden
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  // 2) user‐id fetchen (hook‐volgorde blijft gelijk!)
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  // 3) wacht op fonts
  if (!fontsLoaded) return null;

  // 4) upsert‐handler
  const handleAnswer = async (
    question: keyof typeof columnMap,
    value: string
  ) => {
    // update lokale state
    setAnswers((prev) => ({ ...prev, [question]: value }));
    if (!userId) return;

    const column = columnMap[question];
    const { error } = await supabase
      .from("profiles_breed_matches")
      .upsert({ user_id: userId, [column]: value }, { onConflict: "user_id" });

    if (error) {
      console.error("DB save error:", error.message);
    }
  };

  const canNext = answers.experience !== "" && answers.preferredSize !== "";

  const experienceOptions = [
    { label: "Ik heb nog geen ervaring met honden", value: "none" },
    {
      label: "Ik heb al eens een hond gehad of ken er veel over",
      value: "some",
    },
    {
      label: "Honden zijn altijd al deel van mijn leven geweest",
      value: "extensive",
    },
  ];
  const sizeOptions = [
    { label: "Klein en compact – makkelijk mee te nemen", value: "small" },
    { label: "Middelgroot – ideaal voor thuis én onderweg", value: "medium" },
    {
      label: "Groot en imposant – ik hou van honden met aanwezigheid",
      value: "large",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Titel */}
      <Text style={styles.title}>Ervaring & grootte</Text>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill2} />
      </View>

      {/* Vraag ervaring */}
      <Text style={styles.question}>Hoeveel ervaring heb je met honden?</Text>
      {experienceOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.experience === opt.value}
            onPress={() => handleAnswer("experience", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      {/* Vraag grootte */}
      <Text style={[styles.question, { marginTop: 32 }]}>
        Hoe groot mag je hond zijn?
      </Text>
      {sizeOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.preferredSize === opt.value}
            onPress={() => handleAnswer("preferredSize", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      {/* Volgende knop */}
      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/family_environment")}
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
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 20 : 50,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#183A36",
    textAlign: "center",
    marginBottom: 25,
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
  progressFill2: {
    width: "28.56%",
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
