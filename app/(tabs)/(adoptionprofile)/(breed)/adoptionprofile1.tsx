import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";

function AdoptionProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container} className="bg-baby-powder">
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <BaseText style={styles.title} variant="title">
        Adoptieprofiel
      </BaseText>

      <View style={styles.textContainer}>
        <BaseText style={styles.text}>
          Je profiel is aangemaakt! Laten we nu ontdekken welk hondenras écht
          bij jou past.
        </BaseText>
        <BaseText style={styles.text}>
          Beantwoord een paar korte vragen en ontvang een persoonlijke
          aanbeveling.
        </BaseText>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/livingsituation")}
      >
        <BaseText style={styles.buttonText}>adoptieprofiel opzetten</BaseText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonTransparent}>
        <BaseText style={styles.buttonText}>overslaan</BaseText>
      </TouchableOpacity>
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
    color: "#183A36",
    marginBottom: 50,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "Nunito-Bold",
    width: "100%",
  },
  textContainer: {
    marginBottom: 50,
  },
  text: {
    fontSize: 16,
    color: "#183A36",
    marginBottom: 15,
    fontFamily: "Nunito-Regular",
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
  buttonTransparent: {
    borderColor: "#97B8A5",
    borderWidth: 2,
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
    fontFamily: "Nunito-Bold",
  },
});

export default AdoptionProfileScreen;
