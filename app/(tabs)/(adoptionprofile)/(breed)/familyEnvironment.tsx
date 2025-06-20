import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

export default function FamilyEnvironment() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    children: "",
    otherPets: "",
  });

  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaRegular: require("@/assets/fonts/Sirenia/SireniaRegular.ttf"),
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("adoption_profiles")
        .select("has_children, has_pets")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setAnswers({
          children: data.has_children || "",
          otherPets: data.has_pets || "",
        });
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleAnswer = async (
    question: "children" | "otherPets",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);
    if (!userId) return;

    const payload = {
      user_id: userId,
      has_children: newAnswers.children,
      has_pets: newAnswers.otherPets,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("DB save error:", error.message);
  };

  const canNext = answers.children !== "" && answers.otherPets !== "";

  const childrenOptions = [
    { label: "Ja, met jonge kinderen", value: "young" },
    { label: "Ja, met tieners of oudere kinderen", value: "teens" },
    { label: "Nee, er zijn geen kinderen in huis", value: "none" },
  ];

  const otherPetsOptions = [
    { label: "Ja, één of meerdere honden", value: "dogs" },
    { label: "Ja, katten of andere dieren", value: "cats" },
    { label: "Nee, dit wordt ons eerste huisdier", value: "first_pet" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/experienceSize")} style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
          </TouchableOpacity>
          <BaseText style={styles.title}>Gezin & ervaring</BaseText>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill3} />
      </View>

      <BaseText style={styles.question}>Woon je samen met kinderen?</BaseText>
      {childrenOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("children", opt.value)}
        >
          <RadioButton selected={answers.children === opt.value} />
          <BaseText style={styles.answerText}>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <BaseText style={[styles.question, { marginTop: 32 }]}>
        Heb je al andere huisdieren?
      </BaseText>
      {otherPetsOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("otherPets", opt.value)}
        >
          <RadioButton selected={answers.otherPets === opt.value} />
          <BaseText style={styles.answerText}>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/activityPersonality")}
        disabled={!canNext}
      >
        <BaseText style={styles.buttonText}>VOLGENDE</BaseText>
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
    },
    backButton: {
      position: "absolute",
      left: 5,
      top:7,
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
  progressFill3: {
    width: "42.84%",
    height: "100%",
    backgroundColor: "#FFD87E",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  question: {
    fontFamily: "NunitoBold",
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#97B8A5",
  },
  answerText: {
    fontFamily: "NunitoRegular",
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
    fontFamily: "NunitoBold",
    fontSize: 16,
    color: "#183A36",
  },
});
