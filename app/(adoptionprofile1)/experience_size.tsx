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

export default function ExperienceSize() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    experience: "",
    preferredSize: "",
  });

  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  // ✅ Haal Supabase user ID op
  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      const uid = session?.session?.user.id;
      if (!uid) return;

      setUserId(uid);

      const { data, error } = await supabase
        .from("adoption_profiles")
        .select("experience_level, preferred_size")
        .eq("user_id", uid)
        .single();

      if (data) {
        setAnswers({
          experience: data.experience_level || "",
          preferredSize: data.preferred_size || "",
        });
      }

      if (error) {
        console.warn(
          "⚠️ Geen bestaande antwoorden gevonden of andere fout:",
          error.message
        );
      }
    })();
  }, []);

  // ✅ Als fonts nog niet geladen zijn, toon niets
  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "experience" | "preferredSize",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    console.log("🟡 Antwoord aangepast:", question, "→", value);
    console.log("📦 Huidige answer state:", newAnswers);

    if (!userId || typeof userId !== "string") {
      console.error("❌ Ongeldige userId:", userId);
      return;
    }

    const payload: Record<string, any> = {
      user_id: userId,
      experience_level: newAnswers.experience,
      preferred_size: newAnswers.preferredSize,
    };

    console.log("📤 Payload voor Supabase upsert:", payload);

    const { error } = await supabase
      .from("adoption_profiles") // ⚠️ tabel aangepast!
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("❌ DB save error:", error.message);
    else console.log("✅ Antwoorden opgeslagen:", payload);
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
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Ervaring & grootte</Text>
      <View style={styles.progressBar}>
        <View style={styles.progressFill2} />
      </View>

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
  progressFill2: {
    width: "28.56%", // 2/7 stappen
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
