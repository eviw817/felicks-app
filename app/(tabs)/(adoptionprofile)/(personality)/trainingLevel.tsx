"use client";

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import BaseText from "@/components/BaseText";

const RadioButton = ({ selected }: { selected: boolean }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
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
      { onConflict: "user_id" }
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <BaseText style={styles.title} variant="title">
          Training
        </BaseText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "37.5%" }]} />
      </View>

      <BaseText style={styles.question}>
        In hoeverre moet de hond getraind zijn?
      </BaseText>

      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => setTrainingLevel(opt.value)}
          activeOpacity={0.8}
        >
          <RadioButton selected={trainingLevel === opt.value} />
          <BaseText style={styles.answerText}>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !trainingLevel && styles.buttonDisabled]}
        onPress={handleAnswer}
        disabled={!trainingLevel}
      >
        <BaseText style={styles.buttonText}>VOLGENDE</BaseText>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Sirenia-Regular",
    color: "#183A36",
    textAlign: "center",
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
    width: 20,
    height: 20,
    borderRadius: 10,
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
    color: "#183A36",
    fontWeight: "bold",
  },
});
