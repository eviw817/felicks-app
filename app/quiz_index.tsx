import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";

export default function QuizIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
       <FontAwesome name="arrow-left" size={20} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Bewustzijn quiz</Text>

      <Text style={styles.question}>
        Wat is het doel van deze quiz?
      </Text>

      <Text style={styles.description}>
        Deze pagina is bedoeld om elke week een quiz te doen om jouw kennis te testen.{"\n"}
        Zodat je kan zien hoe goed jij vororbereid bent op een viervoeter.{"\n\n"}
        Bij een fout antwoord krijg je altijd de juiste oplossing.{"\n\n"}
        Ga ervoor en verbreed je kennis!
      </Text>

      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueText}>DOORGAAN</Text>
      </TouchableOpacity>
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

  backButton: {
    position: "absolute",
    top: 95,
    left: 20,
  },

  backText: {
    fontSize: 16,
    
  },

  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginTop: 75,
    textAlign: "center",
  },

  question: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 10,
    marginTop: 50,
  },

  description: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    
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
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    
  },
});
