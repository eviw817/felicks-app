"use client";

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

const RadioButton = ({
  selected,
  onPress,
}: {
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.radioOuter} onPress={onPress}>
    {selected && <View style={styles.radioInner} />}
  </TouchableOpacity>
);

export default function TrainingLevel() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [trainingLevel, setTrainingLevel] = useState<string>("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("adoption_dog_preferences")
        .select("training_level")
        .eq("user_id", user.id)
        .single();

      if (data?.training_level) {
        setTrainingLevel(data.training_level);
      }
    })();
  }, []);

  const handleAnswer = async () => {
    if (!userId) return;

    const { error } = await supabase.from("adoption_dog_preferences").upsert(
      {
        user_id: userId,
        training_level: trainingLevel,
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      Alert.alert("Fout", "Kon voorkeur niet opslaan.");
    } else {
      router.push("/interaction");
    }
  };

  const options = [
    { label: "Geen training nodig", value: "geen" },
    { label: "Basiscommando’s", value: "basis" },
    { label: "Gehoorzaam en sociaal", value: "gehoorzaam" },
    { label: "Gevorderd", value: "gevorderd" },
    { label: "Volledig getraind", value: "volledig" },
    { label: "Geen voorkeur", value: "geen_voorkeur" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Training</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "37.5%" }]} />
      </View>

      <Text style={styles.question}>
        In hoeverre moet de hond getraind zijn?
      </Text>

      {options.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={trainingLevel === opt.value}
            onPress={() => setTrainingLevel(opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, !trainingLevel && styles.buttonDisabled]}
        onPress={handleAnswer}
        disabled={!trainingLevel}
      >
        <Text style={styles.buttonText}>VOLGENDE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 50,
  },
  back: { paddingBottom: 8 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#183A36",
    textAlign: "left",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#F8F8F8",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 24,
    borderColor: "#FFD87E",
    borderWidth: 1,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD87E",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    fontSize: 16,
    color: "#183A36",
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
    color: "#FFFDF9",
    fontWeight: "bold",
  },
});
