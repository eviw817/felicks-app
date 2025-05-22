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
const RadioButton: React.FC<{ selected: boolean; onPress: () => void }> = ({
  selected,
  onPress,
}) => (
  <TouchableOpacity style={styles.radioOuter} onPress={onPress}>
    {selected && <View style={styles.radioInner} />}
  </TouchableOpacity>
);

export default function LivingSituation() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    livingSituation: "",
    homeFrequency: "",
  });

  // ✅ Font laden
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  useEffect(() => {
    (async () => {
      // ✅ Haal de gebruiker op
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user?.id) {
        console.error("❌ Geen gebruiker gevonden:", userError?.message);
        return;
      }

      const uid = userData.user.id;
      setUserId(uid);
      console.log("✅ Supabase user ID:", uid);

      // ✅ Haal bestaande ingevulde antwoorden op (indien aanwezig)
      const { data: existingProfile, error: fetchError } = await supabase
        .from("adoption_profiles")
        .select("living_situation, home_frequency")
        .eq("user_id", uid)
        .single();

      if (fetchError) {
        if (fetchError.code !== "PGRST116") {
          console.error(
            "❌ Fout bij ophalen bestaande antwoorden:",
            fetchError.message
          );
        } else {
          console.log("ℹ️ Geen bestaand profiel gevonden.");
        }
      } else if (existingProfile) {
        console.log("✅ Bestaande antwoorden geladen:", existingProfile);
        setAnswers({
          livingSituation: existingProfile.living_situation || "",
          homeFrequency: existingProfile.home_frequency || "",
        });
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  // ✅ Bijwerken van antwoord + opslaan in DB
  const handleAnswer = async (
    question: "livingSituation" | "homeFrequency",
    value: string
  ) => {
    // Update lokale state
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    console.log("🟡 Antwoord aangepast:", question, "→", value);
    console.log("📦 Huidige answer state:", newAnswers);

    // Controleer of userId beschikbaar is
    if (!userId) {
      console.error("❌ userId is niet beschikbaar");
      return;
    }

    // Bouw payload met actuele waarden
    const payload = {
      user_id: userId,
      living_situation: newAnswers.livingSituation,
      home_frequency: newAnswers.homeFrequency,
    };

    console.log("📤 Payload voor Supabase upsert:", payload);

    // ✅ Supabase upsert (insert of update bij bestaande user_id)
    const { error } = await supabase
      .from("adoption_profiles")
      .upsert([payload], { onConflict: "user_id" }); // moet array zijn

    if (error) {
      console.error("❌ DB save error:", error.message);
    } else {
      console.log("✅ Payload opgeslagen in DB");
    }
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
      {/* Terugknop */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Woonsituatie</Text>

      {/* voortgangsbalk */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill1} />
      </View>

      {/* Vraag 1 */}
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

      {/* Vraag 2 */}
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

      {/* Volgende knop */}
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

// ✅ Styling
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
  progressFill1: {
    width: "14.28%",
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
