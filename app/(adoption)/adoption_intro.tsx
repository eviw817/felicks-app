"use client";

import { useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AdoptieIntro() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="#183A36" />
          </TouchableOpacity>
          <Text style={styles.title}>Adoptie</Text>
        </View>

        <Text style={styles.subtitle}>Welkom op de adoptiepagina</Text>

        <Text style={styles.paragraph}>
          Wat fijn dat je geïnteresseerd bent in het adopteren van een hond!
          Hier vind je alle informatie die je nodig hebt om jouw nieuwe maatje
          te vinden.
        </Text>
        <Text style={styles.paragraph}>
          We begeleiden je stap voor stap in het proces en helpen je om een hond
          te kiezen die perfect past bij jouw levensstijl en voorkeuren.
        </Text>
        <Text style={styles.paragraph}>
          Zodra je jouw ideale hond hebt gevonden, kun je een aanvraag indienen.
          Wij zorgen ervoor dat je aanvraag bij het juiste asiel terechtkomt.
        </Text>
        <Text style={styles.paragraph}>
          Samen maken we een verschil en geven we deze honden een tweede kans op
          liefde en een thuis!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(adoption)/missing_adoption_profile")}
        >
          <Text style={styles.buttonText}>DOORGAAN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  back: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 22,
    fontFamily: "Sirenia-Regular",
    color: "#183A36",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#183A36",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    color: "#183A36",
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },
  buttonText: {
    color: "#183A36",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
