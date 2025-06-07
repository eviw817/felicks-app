import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import BaseText from "@/components/BaseText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useFonts } from "expo-font";

const ForgetPasswordScreen = () => {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const [emailFocus, setEmailFocus] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Functie om te controleren of er tekst is ingevoerd
  const isEmailFilled = email.trim() !== "";

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Fout", "Voer een geldig e-mailadres in.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "com.anonymous.felicksapp://newPassword",
    });

    if (error) {
      Alert.alert("Fout", "Deze e-mail is niet geregistreerd.");
    } else {
      router.push("/notificationEmail");
    }

    setLoading(false);
  };

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={styles.backButton}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={30}
            color={"#183A36"}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <BaseText style={styles.title}>Wachtwoord vergeten</BaseText>
      </View>

      {/* E-mail input */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[
          styles.input,
          emailFocus || isEmailFilled
            ? styles.focusedInput
            : styles.unfocusedInput,
        ]}
        placeholder="E-mail"
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        keyboardType="email-address"
        onFocus={() => setEmailFocus(true)}
        onBlur={() => setEmailFocus(false)}
        onChangeText={setEmail}
        value={email}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>VERZEND</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFDF9",
  },
  title: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    color: "#183A36",
    marginBottom: 60,
    textAlign: "center",
    paddingHorizontal: 40,
    marginTop: -15,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
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
    marginTop: 20,
  },
  buttonText: {
    color: "#183A36",
    fontSize: 16,
    fontFamily: "NunitoBold",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: "NunitoBold",
    color: "#183A36",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#97B8A5",
    marginBottom: 25,
    fontSize: 16,
    color: "#183A36",
    paddingLeft: 15,
  },
  focusedInput: {
    borderBottomColor: "#183A36",
  },
  unfocusedInput: {
    borderBottomColor: "#97B8A5",
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: 7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    paddingVertical: 10,
  },
});

export default ForgetPasswordScreen;
