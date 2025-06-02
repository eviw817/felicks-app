'use client';
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BaseText from "@/components/BaseText";

import { useRouter, Link } from "expo-router";
import NavBar from "@/components/NavigationBar";

export default function QuizIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace("../bewustzijnIndex")}
        style={styles.backButton}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // //aangepast zodat het klikbare gebied rond pijl groter is 
      >
        
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#183A36" />

      </TouchableOpacity>

      <BaseText style={styles.title}>Bewustzijn</BaseText>

      <Text style={styles.question}>
        Wat is het doel van deze quiz?
      </Text>

      <Text style={styles.description}>
        Deze pagina is bedoeld om elke week een quiz te doen om jouw kennis te testen.{"\n"}
        Zodat je kan zien hoe goed jij voorbereid bent op een viervoeter.{"\n\n"}
        Bij een fout antwoord krijg je altijd de juiste oplossing.{"\n\n"}
        Ga ervoor en verbreed je kennis!
      </Text>

      <Link
        style={styles.continueButton}
        href="../quizVragen">
        <Text style={styles.continueText}>DOORGAAN</Text>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
    color: "#183A36",
    textAlign: "left",
  },

  backButton: { //aangepast zodat het klikbare gebied rond pijl groter is 
    position: "absolute",
    top: 84,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "#FFFDF9",
    borderRadius: 20,
  },

  title: {
    fontSize: 24,
    fontFamily: 'SireniaMedium',
    marginTop: 75,
    textAlign: "center",
  },

  question: {
    fontSize: 18,
    fontFamily: 'NunitoSemiBold',
    marginBottom: 10,
    marginTop: 50,
  },

  description: {
    fontSize: 16,
    fontFamily: 'NunitoRegular',
    marginBottom: 20,
  },

  continueButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },

  continueText: {
    fontFamily: 'NunitoExtraBold',
    fontSize: 14,
    textAlign: "center",
  },
});
