import React, { useEffect } from "react";
import { useRouter, Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useFonts } from "expo-font";

function LoginRegisterScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/assets/images/logo_felicks.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>
        Welkom bij Felicks!
      </Text>
      <Text style={styles.subtitle}>
        Ontdek of een hond bij jouw levensstijl past. Felicks helpt je met het
        maken van een weloverwogen keuze!
      </Text>
      <Link style={styles.button} href="/login">
        <Text style={styles.buttonText}>Inloggen</Text>
      </Link>
      <Link style={styles.button} href="/register">
        <Text style={styles.buttonText}>Registeren</Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFDF9",
  },
  logo: {
    width: 280,
    height: 280,
    resizeMode: "contain",
    marginBottom: -50,
  },
  title: {
    fontSize: 18,
    color: "#183A36",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "NunitoBold",
    paddingHorizontal: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#183A36",
    marginBottom: 50,
    paddingHorizontal: 10,
    fontFamily: "NunitoRegular",
  },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#183A36",
    fontSize: 16,
    fontFamily: "NunitoBold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default LoginRegisterScreen;
