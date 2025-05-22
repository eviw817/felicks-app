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

export default function DogAge() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [preferredAge, setPreferredAge] = useState<string>("");

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
        .select("preferred_age")
        .eq("user_id", user.id)
        .single();

      if (data && data.preferred_age) {
        setPreferredAge(data.preferred_age);
      }
    })();
  }, []);

  const handleAnswer = async () => {
    if (!userId) return;

    const { error } = await supabase.from("adoption_dog_preferences").upsert(
      {
        user_id: userId,
        preferred_age: preferredAge,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      Alert.alert("Fout", "Kon voorkeur niet opslaan.");
    } else {
      router.push("/training_level"); // Volgende stap in flow
    }
  };

  const options = [
    { label: "Geen voorkeur", value: "geen_voorkeur" },
    { label: "Puppy", value: "puppy" },
    { label: "Jonge hond", value: "jong_volwassen" },
    { label: "Volwassen hond", value: "volwassen" },
    { label: "Senior", value: "senior" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Leeftijd</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "25%" }]} />
      </View>

      <Text style={styles.question}>Welke leeftijd heeft je ideale hond?</Text>

      {options.map((opt) => (
        <View key={opt.value} style={styles.radioRow}>
          <RadioButton
            selected={preferredAge === opt.value}
            onPress={() => setPreferredAge(opt.value)}
          />
          <Text style={styles.answerText}>{opt.label}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, !preferredAge && styles.buttonDisabled]}
        onPress={handleAnswer}
        disabled={!preferredAge}
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
    color: "#183A36",
    fontWeight: "bold",
  },
});
