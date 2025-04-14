import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";  
import * as Linking from 'expo-linking';

const NotficationEmailScreen = () => {
    const router = useRouter();
  
    useEffect(() => {
      const handleDeepLink = (event: { url: string }) => {
        let url = event.url;
        console.log("Deep link ontvangen:", url);
    
        // Zowel search als hash uitlezen
        const parsedUrl = new URL(url);
        const searchParams = new URLSearchParams(parsedUrl.search);
        const hashParams = new URLSearchParams(parsedUrl.hash.replace('#', ''));
    
        const token = searchParams.get('access_token') || hashParams.get('access_token');
    
        if (url.includes("login/password/newpassword")) {
          if (token) {
            console.log("Token ontvangen:", token);
            // Stuur gebruiker naar de nieuwe wachtwoord-pagina
            router.replace(`/login/password/newpassword?access_token=${token}`);
          } else {
            Alert.alert("Fout", "Geen geldig token in de deep link.");
          }
        }
      };
    
      const subscription = Linking.addEventListener("url", handleDeepLink);
    
      return () => {
        subscription.remove();
      };
    }, []);
    
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wachtwoord vergeten</Text>

      {/* E-mail input */}
      <Text style={styles.subtitle}>Er is een e-mail verzonden naar de e-mail adres. 
      Check uw e-mail om uw wachtwoord te veranderen.
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
    fontSize: 23,
    fontWeight: "bold",
    color: '#183A36',
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    color: '#183A36',
    marginBottom: 50,
  },
});

export default NotficationEmailScreen;
