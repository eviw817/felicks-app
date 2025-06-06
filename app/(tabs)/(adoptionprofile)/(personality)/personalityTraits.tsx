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
import { supabase } from "../../../../lib/supabase";
import BaseText from "@/components/BaseText";

const Checkbox = ({ selected }: { selected: boolean }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
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
      router.push("/dogAge");
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <BaseText style={styles.title} variant="title">
          Adoptie
        </BaseText>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "12.5%" }]} />
      </View>

      <BaseText style={styles.question}>
        Welke eigenschappen zoek je in een hond?
      </BaseText>

      {options.map((trait) => (
        <TouchableOpacity
          key={trait}
          style={styles.radioRow}
          onPress={() => toggleTrait(trait)}
          activeOpacity={0.8}
        >
          <Checkbox selected={selectedTraits.includes(trait)} />
          <BaseText style={styles.answerText}>{trait}</BaseText>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.button,
          selectedTraits.length === 0 && styles.buttonDisabled,
        ]}
        onPress={handleAnswer}
        disabled={selectedTraits.length === 0}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  back: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 22,
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