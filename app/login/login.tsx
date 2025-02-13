import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";  

const LoginScreen = () => {
  const router = useRouter();
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Functie om te controleren of er tekst is ingevoerd
  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inloggen</Text>

      {/* E-mail input */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[
          styles.input, 
          emailFocus || isEmailFilled ? styles.focusedInput : styles.unfocusedInput
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
      <TextInput
        style={[
          styles.input, 
          passwordFocus || isPasswordFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="Wachtwoord" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        secureTextEntry 
        onFocus={() => setPasswordFocus(true)} 
        onBlur={() => setPasswordFocus(false)} 
        onChangeText={setPassword}
        value={password}
      />

      {/* Wachtwoord vergeten */}
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={() => alert("Wachtwoord reset functionaliteit")}>
          <Text style={styles.forgotPassword}>Wachtwoord vergeten?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>INLOGGEN</Text>
      </TouchableOpacity>

      {/* Registreren link */}
      <Text style={styles.registerText}>
        Nog geen account?{" "}
        <Text style={styles.registerLink} onPress={() => router.push("/register/register")}>
          Registreer hier
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFDF9',
  },
  title: {
    textTransform: "uppercase",
    fontSize: 23,
    fontWeight: "bold",
    color: '#183A36',
    marginBottom: 60,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: '#97B8A5',
    paddingVertical: 15,
    borderRadius: 20, 
    marginBottom: 20,
    width: '97%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#183A36',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
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
  },
  focusedInput: {
    borderBottomColor: '#183A36', 
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
  },
  forgotPasswordContainer: {
    width: "100%", 
    alignItems: 'flex-end', 
    marginBottom: 30,
  },
  registerText: {
    fontSize: 14,
    color: "#183A36",
  },
  registerLink: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
