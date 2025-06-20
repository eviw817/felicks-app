// app/quiz-vragen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";

import BaseText from "@/components/BaseText";
import { supabase } from "@/lib/supabaseClient";

type DBQuizRow = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string | null;
};

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export default function AwarenessQuiz() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from<"quiz_questions", DBQuizRow>("quiz_questions")
        .select(
          `
          question,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          explanation
        `
        )
        .order("created_at", { ascending: true });

      if (fetchError || !data) {
        console.error(fetchError);
        setError(fetchError?.message ?? "Kon de quizvragen niet laden.");
      } else {
        const mapped = data.map((row) => {
          const opts = [
            row.option_a,
            row.option_b,
            ...(row.option_c ? [row.option_c] : []),
            ...(row.option_d ? [row.option_d] : []),
          ];

          const correctText = (() => {
            switch (row.correct_option) {
              case "A":
                return row.option_a;
              case "B":
                return row.option_b;
              case "C":
                return row.option_c ?? "";
              case "D":
                return row.option_d ?? "";
            }
          })();

          return {
            question: row.question,
            options: opts,
            correctAnswer: correctText,
            explanation: row.explanation ?? "Geen uitleg beschikbaar.",
          };
        });

        setQuestions(mapped);
      }

      setLoading(false);
    };

    loadQuestions();
  }, []);

  const current = questions[currentIndex];

  const checkAnswer = () => {
    if (!selected) return;
    setCorrect(selected === current.correctAnswer);
    setChecked(true);
  };

  const next = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      setFinished(true);
    }
  };

  const exitQuiz = () =>
    Alert.alert("Quiz verlaten", "Weet je het zeker?", [
      { text: "Nee", style: "cancel" },
      { text: "Ja", onPress: () => router.replace("../bewustzijnIndex") },
    ]);

  if (loading)
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#97B8A5" />
        <BaseText style={styles.loadingText}>Laden…</BaseText>
      </View>
    );

  if (error)
    return (
      <View style={[styles.container, styles.center]}>
        <BaseText style={[styles.loadingText, { color: "red" }]}>
          {error}
        </BaseText>
      </View>
    );

  if (finished)
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <BaseText style={styles.title}>Bewustzijn quiz</BaseText>
        <View style={styles.iconWrapper}>
          <FontAwesome name="check-circle" size={100} color="#FFD87E" />
        </View>
        <BaseText style={styles.description}>
          Goed gedaan, je hebt de quiz volledig afgerond.{"\n"}Hopelijk heb je
          wat bijgeleerd! {"\n"}
          {"\n"}
          Volgende week is er nog een testje, tot dan!
        </BaseText>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace("../bewustzijnIndex")}
        >
          <BaseText style={styles.continueText}>QUIZ AFRONDEN</BaseText>
        </TouchableOpacity>
      </ScrollView>
    );

  // UI
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={exitQuiz} style={styles.backButton}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#183A36" />
      </TouchableOpacity>

      <BaseText style={styles.title}>Bewustzijn quiz</BaseText>
      <BaseText style={styles.question}>Vraag {currentIndex + 1}</BaseText>
      <BaseText style={styles.description}>{current.question}</BaseText>

      {current.options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.optionRow}
          onPress={() => !checked && setSelected(opt)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.radioOuter,
              selected === opt && styles.radioOuterSelected,
            ]}
          >
            {selected === opt && <View style={styles.radioInner} />}
          </View>
          <BaseText style={styles.optionText}>{opt}</BaseText>
        </TouchableOpacity>
      ))}

      {!checked ? (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={checkAnswer}
          disabled={!selected}
        >
          <BaseText style={styles.continueText}>ANTWOORD CONTROLEREN</BaseText>
        </TouchableOpacity>
      ) : (
        <View style={styles.feedbackContainer}>
          {correct ? (
            <BaseText style={styles.correct}>Goed geantwoord!</BaseText>
          ) : (
            <BaseText style={styles.incorrect}>
              Jammer, dit is niet het juiste antwoord.{"\n"}
              Het juiste antwoord was: "{current.correctAnswer}".
            </BaseText>
          )}
          <BaseText style={styles.description2}>
            <BaseText
              style={{
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: "NunitoRegular",
              }}
            >
              Uitleg:{"\n"}
            </BaseText>
            {current.explanation}
          </BaseText>
          <TouchableOpacity style={styles.continueButton} onPress={next}>
            <BaseText style={styles.continueText}>VOLGENDE VRAAG</BaseText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
    paddingTop: 60,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {},
  title: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: 7,
  },
  question: {
    marginTop: 50,
    marginBottom: 10,
    fontSize: 24,
    color: "#183A36",
  },
  description: {
    marginBottom: 20,
    color: "#183A36",
    fontSize: 18,
    fontWeight: "regular",
    textAlign: "left",
  },
  description2: {
    marginBottom: 20,
    color: "#183A36",
    fontSize: 16,

    fontFamily: "NunitoRegular",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
    paddingLeft: 18,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#97B8A5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: "#97B8A5",
  },
  radioInner: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#97B8A5",
  },

  optionText: {
    fontSize: 16,
    fontFamily: "NunitoRegular",
  },
  continueButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 30,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueText: {
    fontFamily: "NunitoExtraBold",
    fontSize: 14,
    textAlign: "center",
    color: "#183A36",
  },

  feedbackContainer: {
    marginTop: 28,
  },
  correct: {
    color: "green",
    marginBottom: 12,
    textAlign: "left",
    fontSize: 18,
  },
  incorrect: {
    color: "#F18B7E",
    marginBottom: 24,
    textAlign: "left",
    fontSize: 18,
  },
  iconWrapper: {
    marginVertical: 40,
    alignItems: "center",
  },
});
