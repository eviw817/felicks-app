import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

function LoginRegisterScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("../login/login");
  };

  const handleRegisterPress = () => {
    router.push("../register/register");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo_felicks.png")}
        style={styles.logo}
      />
      <Text style={styles.title} className="semibold">
        Welkom bij Felicks!
      </Text>
      <Text style={styles.subtitle}>
        Ontdek of een hond bij jouw levensstijl past. Felicks helpt je met het
        maken van een weloverwogen keuze!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>INLOGGEN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
        <Text style={styles.buttonText}>REGISTREREN</Text>
      </TouchableOpacity>
    </View>
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
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#183A36",
    marginBottom: 50,
    paddingHorizontal: 30,
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
    fontWeight: "bold",
  },
});

export default LoginRegisterScreen;
