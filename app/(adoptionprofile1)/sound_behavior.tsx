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

export default function SoundBehavior() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    barking: "",
    training: "",
  });

  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("adoption_profiles")
          .select("barking, training")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error(
            "❌ Ophalen bestaande antwoorden mislukt:",
            error.message
          );
        } else if (data) {
          console.log("✅ Bestaande antwoorden:", data);
          setAnswers({
            barking: data.barking || "",
            training: data.training || "",
          });
        }
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "barking" | "training",
    value: string
  ) => {
    const updatedAnswers = { ...answers, [question]: value };
    setAnswers(updatedAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      barking: updatedAnswers.barking,
      training: updatedAnswers.training,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("❌ DB save error:", error.message);
    else console.log("✅ Antwoorden opgeslagen:", payload);
  };

  const canNext = answers.barking !== "" && answers.training !== "";

  const barkingOptions = [
    { label: "Liever zo stil mogelijk", value: "quiet" },
    { label: "Een beetje blaffen hoort erbij", value: "some" },
    { label: "Een praatgrage hond is geen probleem", value: "talkative" },
  ];

  const trainingOptions = [
    {
      label:
        "Heel belangrijk – ik wil een hond die snel leert en goed luistert",
      value: "very",
    },
    {
      label: "Belangrijk, maar het hoeft geen perfect gehoorzame hond te zijn",
      value: "moderate",
    },
    {
      label:
        "Niet zo belangrijk – ik heb geduld en waardeer een zelfstandige hond",
      value: "independent",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Geluid & gedrag</Text>
      <View style={styles.progressBar}>
        <View style={styles.progressFill5} />
      </View>

      <Text style={styles.question}>Hoeveel mag je hond blaffen?</Text>
      {barkingOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.barking === opt.value}
            onPress={() => handleAnswer("barking", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      <Text style={[styles.question, { marginTop: 32 }]}>
        Hoe belangrijk is training voor jou?
      </Text>
      {trainingOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.training === opt.value}
            onPress={() => handleAnswer("training", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/grooming_coat")}
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
  progressFill5: {
    width: "71.42%",
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
