"use client";

import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";

export default function AdoptionChoice() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <BaseText variant="title" style={styles.title}>
          Adoptie
        </BaseText>
      </View>

      <BaseText style={styles.question}>
        Wil je een hond die meer op jouw persoonlijkheid gebaseerd is of ga je
        liever voor een bepaald ras?
      </BaseText>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/personalityTraits")}
      >
        <BaseText variant="button" style={styles.secondaryText}>
          PERSOONLIJKHEID
        </BaseText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/personalityTraits")}
      >
        <BaseText variant="button" style={styles.secondaryText}>
          RAS
        </BaseText>
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
    color: "#183A36",
    textAlign: "center",
  },
  question: {
    fontSize: 16,
    color: "#183A36",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: "Nunito-Regular",
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
    textTransform: "uppercase",
    fontFamily: "Nunito-Bold",
  },
  secondaryButton: {
    borderColor: "#97B8A5",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryText: {},
});
