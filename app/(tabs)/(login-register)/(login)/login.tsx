import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  AppState,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { AppStateStatus } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import BaseText from "@/components/BaseText";

const LoginScreen = () => {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Functie om te controleren of er tekst is ingevoerd
  const isEmailFilled = email.trim() !== "";
  const isPasswordFilled = password.trim() !== "";

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    fetchSession();

    // Luister naar veranderingen in de authenticatie status
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          supabase.auth.startAutoRefresh();
        } else {
          supabase.auth.stopAutoRefresh();
        }
      }
    );

    // AppState listener voor wanneer de app actief wordt
    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          fetchSession();
        }
      }
    );

    return () => {
      subscription.remove(); // Zorgt voor een correcte cleanup
      authListener?.subscription?.unsubscribe(); // Voorkomt mogelijke fouten
    };
  }, []);

  async function signInWithEmail() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if the error is related to email or password
      if (error.message.includes("email")) {
        Alert.alert(
          "E-mail incorrect",
          "Het ingevoerde e-mail is onjuist. Controleer je e-mail en probeer het opnieuw."
        );
      } else if (error.message.includes("password")) {
        Alert.alert(
          "Wachtwoord incorrect",
          "Het ingevoerde wachtwoord is onjuist. Controleer je wachtwoord en probeer het opnieuw."
        );
      } else {
        // Algemeen foutbericht voor andere fouten
        Alert.alert(
          "Login mislukt",
          "Controleer je e-mail en/of wachtwoord en probeer het opnieuw."
        );
      }
      setLoading(false);
      return;
    }

    router.push("/homepage");
    setLoading(false);
  }

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <BaseText style={styles.title}>Inloggen</BaseText>

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

      {/* Wachtwoord input */}
      <Text style={styles.label}>Wachtwoord</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            passwordFocus || isPasswordFilled
              ? styles.focusedInput
              : styles.unfocusedInput,
            { paddingRight: 40 }, // ruimte voor het oogje
          ]}
          placeholder="Wachtwoord"
          placeholderTextColor="rgba(151, 184, 165, 0.5)"
          secureTextEntry={!showPassword}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={28}
            color="#183A36"
          />
        </TouchableOpacity>
      </View>

      {/* Wachtwoord vergeten */}
      <View style={styles.forgotPasswordContainer}>
        <Link href="/forgetPassword">
          <Text style={styles.forgotPassword}>Wachtwoord vergeten?</Text>
        </Link>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => await signInWithEmail()}
      >
        <Text style={styles.buttonText}>INLOGGEN</Text>
      </TouchableOpacity>

      {/* Registreren link */}
      <Text style={styles.registerText}>
        Nog geen account?{" "}
        <Link style={styles.registerLink} href="/register">
          Registreer hier
        </Link>
      </Text>
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
    marginBottom: 60,
    textAlign: "center",
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
  forgotPassword: {
    alignSelf: "flex-end",
    textAlign: "right",
    color: "#183A36",
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "NunitoRegular",
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  registerText: {
    fontSize: 14,
    color: "#183A36",
    fontFamily: "NunitoRegular",
  },
  registerLink: {
    fontFamily: "NunitoBold",
  },
  passwordContainer: {
    width: "100%",
    marginBottom: -3,
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
});

export default LoginScreen;
