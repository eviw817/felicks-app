import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter  } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { Linking } from 'react-native';

const NewPasswordScreen = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nieuwpasswordFocus, setNieuwPasswordFocus] = useState(false);
  const [herhaalpasswordFocus, setHerhaalPasswordFocus] = useState(false);

  const [nieuwpassword, setNieuwPassword] = useState('');
  const [herhaalpassword, setHerhaalPassword] = useState('');

  const isNieuwPasswordFilled = nieuwpassword.trim() !== '';
  const isHerhaalPasswordFilled = herhaalpassword.trim() !== '';
  
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsedUrl = new URL(url);
      const hashParams = new URLSearchParams(parsedUrl.hash.replace('#', ''));
      const token = hashParams.get('access_token');
      
      if (token) {
        setAccessToken(token);
      } else {
        console.error("Geen token gevonden in de hash van de URL.");
      }
    };
  
    const subscription = Linking.addEventListener('url', handleUrl);
  
    return () => {
      subscription.remove();
    };
  }, []);
  

  const handleResetPassword = async () => {
    if (!nieuwpassword || !herhaalpassword) {
      Alert.alert("Fout", "Voer een nieuw wachtwoord in.");
      return;
    }

    if (nieuwpassword !== herhaalpassword) {
      Alert.alert("Fout", "De wachtwoorden komen niet overeen.");
      return;
    }

    if (!accessToken) {
      Alert.alert("Fout", "Token niet gevonden.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: nieuwpassword,
      });

      if (error) {
        Alert.alert("Fout", "Er is iets misgegaan bij het resetten van je wachtwoord.");
      } else {
        Alert.alert("Succes", "Je wachtwoord is succesvol gereset.");
        router.push("/login/login");
      }
    } catch (error) {
      console.error("Error tijdens het resetten van het wachtwoord:", error);
      Alert.alert("Fout", "Er is iets misgegaan bij het resetten van je wachtwoord.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset wachtwoord</Text>

    <Text style={styles.label}>Nieuw wachtwoord</Text>
      <TextInput
        style={[
          styles.input, 
          nieuwpasswordFocus || isNieuwPasswordFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="Nieuw wachtwoord" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        secureTextEntry 
        onFocus={() => setNieuwPasswordFocus(true)} 
        onBlur={() => setNieuwPasswordFocus(false)} 
        onChangeText={setNieuwPassword}
        value={nieuwpassword}
      />

      {/* herhaal wachtwoord input */}
      <Text style={styles.label}>Herhaal nieuw wachtwoord</Text>
      <TextInput
        style={[
          styles.input, 
          herhaalpasswordFocus || isHerhaalPasswordFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="Herhaal nieuw wachtwoord" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        secureTextEntry 
        onFocus={() => setHerhaalPasswordFocus(true)} 
        onBlur={() => setHerhaalPasswordFocus(false)} 
        onChangeText={setHerhaalPassword}
        value={herhaalpassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        <Text style={styles.buttonText}>OPSLAAN</Text>
      </TouchableOpacity>
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
    paddingLeft: 15,
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

export default NewPasswordScreen;
