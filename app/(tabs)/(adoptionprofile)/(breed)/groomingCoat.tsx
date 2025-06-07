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
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View style={styles.radioOuter}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

export default function GroomingCoat() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    grooming: "",
    shedding: "",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("adoption_profiles")
          .select("grooming, shedding")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error(
            "❌ Ophalen bestaande antwoorden mislukt:",
            error.message
          );
        } else if (data) {
          setAnswers({
            grooming: data.grooming || "",
            shedding: data.shedding || "",
          });
        }
      }
    })();
  }, []);

  const handleAnswer = async (
    question: "grooming" | "shedding",
    value: string
  ) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    if (!userId) return;

    const payload = {
      user_id: userId,
      grooming: newAnswers.grooming,
      shedding: newAnswers.shedding,
    };

    const { error } = await supabase
      .from("adoption_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) console.error("❌ DB save error:", error.message);
  };

  const canNext = answers.grooming !== "" && answers.shedding !== "";

  const groomingOptions = [
    {
      label: "Zo weinig mogelijk – ik hou het graag praktisch",
      value: "minimal",
    },
    { label: "Af en toe borstelen? Dat hoort erbij", value: "occasional" },
    { label: "Dagelijks borstelen is voor mij qualitytime", value: "daily" },
  ];

  const sheddingOptions = [
    { label: "Ik hou m’n huis graag netjes en haarvrij", value: "no_hair" },
    {
      label: "Een beetje haar? Daar lig ik niet van wakker",
      value: "some_hair",
    },
    { label: "Ik accepteer dat het erbij hoort", value: "accept_hair" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/soundBehavior")} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                </TouchableOpacity>
                <BaseText style={styles.title}>Verzorging & vacht</BaseText>
            </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill6} />
      </View>

      <BaseText style={styles.question}>
        Hoeveel verzorging wil je geven?
      </BaseText>
      {groomingOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("grooming", opt.value)}
        >
          <RadioButton selected={answers.grooming === opt.value} />
          <BaseText style={styles.answerText}>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <BaseText style={[styles.question, { marginTop: 32 }]}>
        Wat vind je van hondenhaar in huis?
      </BaseText>
      {sheddingOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioRow}
          onPress={() => handleAnswer("shedding", opt.value)}
        >
          <RadioButton selected={answers.shedding === opt.value} />
          <BaseText style={styles.answerText}>{opt.label}</BaseText>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.buttonDisabled]}
        onPress={() => router.push("/adoptionprofileResults")}
        disabled={!canNext}
      >
        <BaseText style={styles.buttonText} variant="button">
          VOLGENDE
        </BaseText>
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
        marginLeft: 25,
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
  progressFill6: {
    width: "85.71%",
    height: "100%",
    backgroundColor: "#FFD87E",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  question: {
    fontSize: 18,
    fontFamily: "NunitoBold",
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
