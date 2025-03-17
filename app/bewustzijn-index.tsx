import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useFonts } from 'expo-font';
import { useRouter } from "expo-router"; // Import useRouter

export default function BewustzijnScreen() {
  const router = useRouter(); // Gebruik de router om te navigeren

  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("../assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/nunito/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/nunito/Nunito-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const topics = [
    { title: "VOEDING", image: require("../assets/images/voeding.png") },
    { title: "VEILIGHEID", image: require("../assets/images/veiligheid.png") },
    { title: "TRAINING", image: require("../assets/images/training.png") },
    { title: "VERZORGING", image: require("../assets/images/verzorging.png") },
    { title: "ACTIVITEIT", image: require("../assets/images/activiteit.png") },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bewustzijn</Text>
      <Text style={styles.subtitle}>Doe de quiz van de week</Text>

      {/* Update: Navigeren naar quiz-index.tsx */}
      <TouchableOpacity style={styles.quizButton} onPress={() => router.push("/quiz_index")}>
        <Text style={styles.quizButtonText}>QUIZ VAN DE WEEK</Text>
      </TouchableOpacity>

      <Text style={styles.learnMore}>Leer meer bij over:</Text>

      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {topics.map((item, index) => (
          <TouchableOpacity key={index} style={styles.infoButton}>
            <View style={styles.infoContent}>
              <Image source={item.image} style={styles.infoImage} />
              <Text style={styles.infoButtonText}>{item.title}</Text>
            </View>
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
    gap: 25,
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
    marginBottom: -13,
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
  },

  buttonContainer: {
    width: "100%",
    gap: 2,
  },

  infoButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 15,
    marginVertical: 5,
    width: "100%",
    paddingHorizontal: 10,
  },

  infoContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoImage: {
    width: 25, 
    height: 25, 
    marginRight: 16, 
    marginLeft: 12,
  },

  infoButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
});
