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
import BaseText from "@/components/BaseText";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function MissingAdoptionProfile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/adoptionChoice")} style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
          </TouchableOpacity>
          <BaseText style={styles.title}>Adoptieprofiel</BaseText>
      </View>

      <BaseText style={styles.text}>
        Je had nog geen adoptieprofiel opgezet bij het registreren van jouw
        account. Voordat je naar de adoptiepagina gaat moet je deze eerst
        invullen.
      </BaseText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/livingsituation")}
      >
        <BaseText style={styles.buttonText}>GA NAAR ADOPTIEPROFIEL</BaseText>
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
