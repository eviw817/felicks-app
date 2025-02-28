import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useFonts } from 'expo-font';



export default function BewustzijnScreen() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/nunito/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <View />; // Wacht tot de fonts geladen zijn
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bewustzijn</Text>
      <Text style={styles.subtitle}>Doe de quiz van de week</Text>

      <TouchableOpacity style={styles.quizButton}>
        <Text style={styles.quizButtonText}>QUIZ VAN DE WEEK</Text>
      </TouchableOpacity>

      <Text style={styles.learnMore}>Leer meer bij over:</Text>

      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {["VOEDING", "VEILIGHEID", "TRAINING", "VERZORGING", "ACTIVITEIT"].map((item, index) => (
          <TouchableOpacity key={index} style={styles.infoButton}>
            <Text style={styles.infoButtonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
    gap:25,
    color: "#183A36",
  },

  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginTop: 75,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    textAlign: "left",
  },

  quizButton: {
    backgroundColor: "#FFD87E",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  quizButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },

  learnMore: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
  },

  buttonContainer: {
    width: "100%",
    gap:2,
    
  },

  infoButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 15,
    marginVertical: 5,
    textAlign: "left",
    width: "100%",
  },

  infoButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
});
