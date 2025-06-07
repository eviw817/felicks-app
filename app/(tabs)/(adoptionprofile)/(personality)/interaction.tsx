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
import { useFonts } from "expo-font";
import BaseText from "@/components/BaseText";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const RadioButton = ({ selected }: { selected: boolean }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

export default function Interaction() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [childInteraction, setChildInteraction] = useState<string>("");
  const [dogInteraction, setDogInteraction] = useState<string>("");

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
        .select("interaction_children, interaction_dogs")
        .eq("user_id", user.id)
        .single();

      if (data) {
        if (data.interaction_children)
          setChildInteraction(data.interaction_children);
        if (data.interaction_dogs) setDogInteraction(data.interaction_dogs);
      }
    })();
  }, []);

  const handleAnswer = async () => {
    if (!userId) return;

    const { error } = await supabase.from("adoption_dog_preferences").upsert(
      {
        user_id: userId,
        interaction_children: childInteraction,
        interaction_dogs: dogInteraction,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      Alert.alert("Fout", "Kon voorkeuren niet opslaan.");
    } else {
      router.push("/energy");
    }
  };

  const interactionOptionsChildren = [
    { label: "Goed", value: "goed" },
    { label: "Niet van toepassing", value: "niet van toepassing" },
  ];

  const interactionOptionsDogs = [
    { label: "Goed", value: "goed" },
    { label: "Beetje", value: "beetje" },
    { label: "Niet van toepassing", value: "niet van toepassing" },
  ];

  const canContinue = childInteraction !== "" && dogInteraction !== "";

  return (
    <SafeAreaView style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push("/trainingLevel")} style={styles.backButton}>
                  <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
              </TouchableOpacity>
              <BaseText style={styles.title}>Interactie</BaseText>
          </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "50%" }]} />
      </View>

      <BaseText style={styles.question}>
        Hoe moet de interactie zijn tegenover kinderen?
      </BaseText>
      {interactionOptionsChildren.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => setChildInteraction(opt.value)}
          activeOpacity={0.8}
        >
          <RadioButton selected={childInteraction === opt.value} />
          <BaseText>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <BaseText style={[styles.question, { marginTop: 32 }]}>
        Hoe moet de interactie zijn tegenover andere honden?
      </BaseText>
      {interactionOptionsDogs.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => setDogInteraction(opt.value)}
          activeOpacity={0.8}
        >
          <RadioButton selected={dogInteraction === opt.value} />
          <BaseText>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        onPress={handleAnswer}
        disabled={!canContinue}
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
        justifyContent: "center", 
        width: "100%",
        position: "relative", 
        paddingVertical: 10,
      },
    title: {
        fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 20,
        marginLeft: 20,
    },
    backButton: {
      position: "absolute",
      left: 5,
      top:7,
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
    marginBottom: 12,
    fontFamily: "NunitoBold",
    color: "#183A36",
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
