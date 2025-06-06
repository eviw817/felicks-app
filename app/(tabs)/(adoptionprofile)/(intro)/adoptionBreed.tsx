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
          Adoptieprofiel
        </BaseText>
      </View>

      <BaseText variant="text" style={styles.description}>
        Je profiel is aangemaakt! Laten we nu ontdekken welk hondenras écht bij
        jou past.
      </BaseText>
      <BaseText variant="text" style={styles.subtitle}>
        Beantwoord een paar korte vragen en ontvang een persoonlijke
        aanbeveling.
      </BaseText>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/livingSituation")}
      >
        <BaseText variant="button" style={styles.primaryText}>
          VIND JOUW PERFECTE RAS
        </BaseText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/homepage")}
      >
        <BaseText variant="button" style={styles.secondaryText}>
          OVERSLAAN
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
    textAlign: "center",
  },
  description: {
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "left",
  },
  subtitle: {
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "left",
  },
  primaryButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryText: {},
  secondaryButton: {
    borderColor: "#97B8A5",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryText: {},
});
