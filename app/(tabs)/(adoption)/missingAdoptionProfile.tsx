"use client";

import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MissingAdoptionProfile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <Text style={styles.title}>Adoptie</Text>
      </View>

      <Text style={styles.text}>
        Je had nog geen adoptieprofiel opgezet bij het registreren van jouw
        account. Voordat je naar de adoptiepagina gaat moet je deze eerst
        invullen.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/adoptionChoice")}
      >
        <Text style={styles.buttonText}>GA NAAR ADOPTIEPROFIEL</Text>
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
    justifyContent: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
  text: {
    fontSize: 16,
    color: "#183A36",
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#183A36",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
