import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

function AdoptionProfileScreen() {
  const [fontsLoaded] = useFonts({
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
  });

  const router = useRouter();

  return (
    <View style={styles.container} className="bg-baby-powder">
      {/* pijltje*/}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* titel */}
      <Text style={styles.title}>Adoptieprofiel</Text>

      {/* text */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Bedankt voor je registratie! Maak nu een adoptieprofiel aan om te
          ontdekken welke hond bij jou past.
        </Text>
        <Text style={styles.text}>
          Vul je voorkeuren en gewoontes in en ontvang gepersonaliseerde
          aanbevelingen. Start vandaag nog en maak een weloverwogen keuze voor
          een nieuwe huisgenoot.
        </Text>
      </View>

      {/* buttons */}
      <Link style={styles.button} href="/livingSituation1">
        <Text style={styles.buttonText}>adoptieprofiel opzetten</Text>
      </Link>

      <Link style={styles.button} href="/homepage">
        <Text style={styles.buttonText}>overslaan</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: "#183A36",
    marginBottom: 50,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "nunitoBold",
    width: "100%",
  },

  textContainer: {
    marginBottom: 50, // alleen ruimte tussen de tekst en de buttons
  },

  text: {
    fontSize: 16,
    color: "#183A36",
    marginBottom: 15,
    fontFamily: "nunitoRegular",
  },

  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonText: {
    color: "#183A36",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    width: "100%",
    fontFamily: "nunitoBold",
  },
});

export default AdoptionProfileScreen;
