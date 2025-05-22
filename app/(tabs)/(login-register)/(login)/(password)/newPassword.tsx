import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import * as SecureStore from 'expo-secure-store';

const NewPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [nieuwpasswordFocus, setNieuwPasswordFocus] = useState(false);
  const [herhaalpasswordFocus, setHerhaalPasswordFocus] = useState(false);

  const [nieuwpassword, setNieuwPassword] = useState('');
  const [herhaalpassword, setHerhaalPassword] = useState('');

  const isNieuwPasswordFilled = nieuwpassword.trim() !== '';
  const isHerhaalPasswordFilled = herhaalpassword.trim() !== '';
  
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      // console.log("Deep link ontvangen:", url);
  
      // Verwerk de URL om zowel query als fragment parameters te verkrijgen
      const parsedUrl = new URL(url);
      const queryParams = new URLSearchParams(parsedUrl.search);
      const fragmentParams = new URLSearchParams(parsedUrl.hash.replace('#', ''));
  
      const accessToken = queryParams.get('access_token') || fragmentParams.get('access_token');
      const refreshToken = queryParams.get('refresh_token') || fragmentParams.get('refresh_token');
  
      if (accessToken) {
        // console.log("Access token ontvangen:", accessToken);
  
        // Sla het token op in SecureStore
        SecureStore.setItemAsync('access_token', accessToken).then(() => {
          // console.log("Access token opgeslagen!");
          router.push('/newPassword'); // Navigeer naar de juiste pagina
        }).catch(error => {
          console.log("Fout bij het opslaan van de token:", error);
        });
      } else {
        console.log("Geen access_token gevonden in deeplink.");
      }
    };
  
    // Luister naar deeplinks
    const linkingListener = Linking.addEventListener('url', handleDeepLink);
  
    // Cleanup listener bij unmount
    return () => {
      linkingListener.remove();
    };
  }, [router]);
  
  
  const handleResetPassword = async () => {
    if (!nieuwpassword || !herhaalpassword) {
      Alert.alert("Fout", "Voer een nieuw wachtwoord in.");
      return;
    }
  
    if (nieuwpassword !== herhaalpassword) {
      Alert.alert("Fout", "De wachtwoorden komen niet overeen.");
      return;
    }
  
    // Haal het token op uit SecureStore
    const storedAccessToken = await SecureStore.getItemAsync('access_token');
    
    if (!storedAccessToken) {
      Alert.alert("Fout", "Token niet gevonden!");
      return;
    }
  
    // Stel de Supabase sessie in met het access token
    const storedRefreshToken = await SecureStore.getItemAsync('refresh_token');
    if (!storedRefreshToken) {
      Alert.alert("Fout", "Refresh token niet gevonden!");
      return;
    }
    supabase.auth.setSession({ access_token: storedAccessToken, refresh_token: storedRefreshToken });
  
    setLoading(true);
  
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: nieuwpassword,
      });
  
      if (error) {
        Alert.alert("Fout", error.message);
      } else {
        Alert.alert("Succes", "Je wachtwoord is succesvol gereset!");
        router.push("/login");
      }
    } catch (err) {
      Alert.alert("Fout", "Er is iets mis gegaan bij het resetten van je wachtwoord.");
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
