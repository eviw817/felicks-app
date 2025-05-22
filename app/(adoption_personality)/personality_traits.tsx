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

const Checkbox = ({
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

export default function PersonalityTraits() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

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
        .select("personality_traits")
        .eq("user_id", user.id)
        .single();

      if (data && Array.isArray(data.personality_traits)) {
        setSelectedTraits(data.personality_traits);
      }
    })();
  }, []);

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    );
  };

  const handleAnswer = async () => {
    if (!userId) return;

    const { error } = await supabase.from("adoption_dog_preferences").upsert(
      {
        user_id: userId,
        personality_traits: selectedTraits,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      Alert.alert("Fout", "Kon voorkeur niet opslaan.");
    } else {
      router.push("/dog_age"); // Volgende scherm
    }
  };

  const options = [
    "Lief en aanhankelijk",
    "Speels en energiek",
    "Rustig en kalm",
    "Intelligent en trainbaar",
    "Sociaal en vriendelijk",
    "Waaks en beschermend",
    "Zachtaardig met kinderen",
    "Onafhankelijk",
    "Aanpasbaar",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Algemene persoonlijkheid</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "12.5%" }]} />
      </View>

      <Text style={styles.question}>
        Welke eigenschappen zoek je in een hond?
      </Text>

      {options.map((trait) => (
        <View key={trait} style={styles.radioRow}>
          <Checkbox
            selected={selectedTraits.includes(trait)}
            onPress={() => toggleTrait(trait)}
          />
          <Text style={styles.answerText}>{trait}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.button,
          selectedTraits.length === 0 && styles.buttonDisabled,
        ]}
        onPress={handleAnswer}
        disabled={selectedTraits.length === 0}
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
