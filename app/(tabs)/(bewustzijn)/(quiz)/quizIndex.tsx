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
        <View style={styles.header}>
                 <TouchableOpacity onPress={() => router.push("/bewustzijnIndex")} style={styles.backButton}>
                 <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                </TouchableOpacity>
                  <BaseText style={styles.title}>Bewustzijn quiz</BaseText>
</View>
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
        {/* Fixed navbar onderaan scherm */}
            <View
                style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                }}
            >
                <NavBar />
            </View>
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
     paddingTop: 100,
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
  question: {
    fontSize: 18,
    fontFamily: 'NunitoSemiBold',
    marginBottom: 10,
    marginTop: 50,
     color: "#183A36",
  },

  description: {
    fontSize: 16,
    fontFamily: 'NunitoRegular',
    marginBottom: 20,
     color: "#183A36",
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
    fontFamily: 'NunitoExtraBold',
    fontSize: 14,
    textAlign: "center",
     color: "#183A36",
  },
   header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        width: "100%",
        position: "relative", 
        paddingVertical: 10,
      },
});
