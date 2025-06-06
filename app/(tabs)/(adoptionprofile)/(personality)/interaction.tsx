"use client";

import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  Pressable,
  FlatList,
} from "react-native";
import BaseText from "@/components/BaseText";

export default function Interaction({ onComplete }: { onComplete: () => void }) {
  const [interactionStep, setInteractionStep] = useState(0);

  const questions = [
    {
      question: "How active is your future pet?",
      options: [
        { label: "Very active", value: "very_active" },
        { label: "Moderately active", value: "moderate" },
        { label: "Calm and relaxed", value: "calm" },
      ],
    },
    {
      question: "How much time can you spend daily with your pet?",
      options: [
        { label: "Several hours", value: "several_hours" },
        { label: "About an hour", value: "one_hour" },
        { label: "Less than an hour", value: "less_than_hour" },
      ],
    },
    // Add more questions here...
  ];

  useEffect(() => {
    if (interactionStep >= questions.length) {
      onComplete();
    }
  }, [interactionStep, questions.length, onComplete]);

  function renderOption(opt: { label: string; value: string }) {
    return (
      <Pressable
        style={styles.button}
        onPress={() => setInteractionStep((prev) => prev + 1)}
      >
        <BaseText style={styles.buttonText}>{opt.label}</BaseText>
      </Pressable>
    );
  }

  if (interactionStep >= questions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <BaseText style={styles.title}>Thank you for completing the questions!</BaseText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === "android" ? 20 : 40 },
      ]}
    >
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            { width: `${(interactionStep / questions.length) * 100}%` },
          ]}
        />
      </View>

      <BaseText style={styles.title}>Personality & Lifestyle</BaseText>

      <BaseText style={styles.question}>
        {questions[interactionStep].question}
      </BaseText>

      <FlatList
        data={questions[interactionStep].options}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => renderOption(item)}
        contentContainerStyle={{ gap: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#d0e7e4",
    borderRadius: 3,
    marginBottom: 12,
    marginTop: 10,
  },
  progress: {
    height: 6,
    backgroundColor: "#183A36",
    borderRadius: 3,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Sirenia-Regular",
    color: "#183A36",
  },
  question: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
    color: "#183A36",
  },
  button: {
    backgroundColor: "#d0e7e4",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#183A36",
    fontWeight: "bold",
  },
  answerText: {
    fontSize: 16,
    color: "#183A36",
  },
});
