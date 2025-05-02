// app/(adoptionprofile1)/living_situation_1.tsx
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

export default function LivingSituation1() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    livingSituation: "",
    homeFrequency: "",
  });

  // Load Nunito fonts
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });
  if (!fontsLoaded) return null;

  // Fetch user ID on mount
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  // Handle selection and upsert to DB
  const handleAnswer = async (
    question: "livingSituation" | "homeFrequency",
    value: string
  ) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    if (!userId) return;
    const { error } = await supabase
      .from("profiles_breed_matches")
      .upsert({ user_id: userId, question, answer: value });
    if (error) console.error("DB save error:", error.message);
  };

  const canNext =
    answers.livingSituation !== "" && answers.homeFrequency !== "";

  const livingOptions = [
    {
      label: "In een gezellig appartement – knus en compact",
      value: "appartement",
    },
    {
      label: "Een huis zonder tuin, maar met wandelopties",
      value: "huisZonderTuin",
    },
    { label: "We hebben een tuin waar de hond kan snuffelen", value: "tuin" },
    {
      label: "Veel ruimte, veel natuur – buiten zijn vanzelfsprekend",
      value: "veelRuimte",
    },
  ];
  const homeOptions = [
    {
      label: "Bijna altijd, ik werk thuis of ben vaak thuis",
      value: "vaakThuis",
    },
    { label: "Gedeeld – soms thuis, soms weg", value: "gedeeld" },
    { label: "Vaak van huis – hond moet alleen kunnen zijn", value: "vaakWeg" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Woonsituatie</Text>

      {/* Progress bar: unfilled has border only */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Question 1 */}
      <Text style={styles.question}>Waar woon je?</Text>
      {livingOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.livingSituation === opt.value}
            onPress={() => handleAnswer("livingSituation", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      {/* Question 2 */}
      <Text style={[styles.question, { marginTop: 32 }]}>
        Hoe vaak ben je thuis?
      </Text>
      {homeOptions.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={answers.homeFrequency === opt.value}
            onPress={() => handleAnswer("homeFrequency", opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/")}
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
    height: 10,
    borderColor: "#FFD87E",
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 25,
  },
  progressFill: {
    width: "11.11%",
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
