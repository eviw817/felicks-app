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
import { useFonts } from "expo-font";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function AdoptionChoice() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
         <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push("/register")} style={styles.backButton}>
                  <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
              </TouchableOpacity>
              <BaseText style={styles.title}>Adoptieprofiel </BaseText>
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
        onPress={() => router.push("/livingsituation")}
      >
        <BaseText variant="button" style={styles.primaryText}>
          Adoptieprofiel opzetten
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
  header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        width: "100%",
        position: "relative", 
        paddingVertical: 10,
      },
    title: {
        fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 20,
    },
    backButton: {
      position: "absolute",
      left: 5,
      top:7,
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
  primaryText: {
    color: "#183A36",
    fontSize: 16,
    fontFamily: "NunitoBold",
    textTransform: "uppercase",
  },
  secondaryButton: {
    borderColor: "#97B8A5",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryText: {},
});
