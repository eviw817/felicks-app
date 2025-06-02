"use client";

import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AdoptionChoice() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <Text style={styles.title}>Adoptie</Text>
      </View>

      <Text style={styles.question}>
        Wil je een hond die meer op jouw persoonlijkheid gebaseerd is of ga je
        liever voor een bepaald ras?
      </Text>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() =>
          router.push("/personalityTraits")
        }
      >
        <Text style={styles.optionText}>PERSOONLIJKHEID</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/livingSituation")}
      >
        <Text style={styles.optionText}>RAS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
  question: {
    fontSize: 16,
    color: "#183A36",
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  optionButton: {
    borderColor: "#183A36",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#183A36",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
