import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";  
import * as Linking from 'expo-linking';

const NotficationEmailScreen = () => {
    const router = useRouter();
  
    useEffect(() => {
      const handleDeepLink = (event: { url: string }) => {
        const { url } = event;
        // console.log("Gevangen URL:", url); // Dit helpt je te debuggen
    
        if (url) {
          try {
            const parsedUrl = new URL(url);
            const hashParams = new URLSearchParams(parsedUrl.hash.replace('#', '')); // Verwijder de '#'
            const token = hashParams.get('access_token'); // Verkrijg het token uit de URL
    
            if (url.includes("/login-register/login/password/newpassword") && token) {
              router.replace(`/login-register/login/password/newpassword?access_token=${token}`);
            } else {
              Alert.alert("Fout", "Geen geldig token in de deep link.");
            }
          } catch (error) {
            console.error("Fout bij het verwerken van de URL:", error);
            Alert.alert("Fout", "Er is een probleem met de deep link.");
          }
        }
      };
    
      // Controleer voor een initiële URL wanneer de app wordt geopend via deep link
      Linking.getInitialURL().then(url => {
        if (url) {
          handleDeepLink({ url });
        }
      });
    
      // Voeg een event listener toe om URL's te verwerken tijdens de levensduur van de component
      const subscription = Linking.addEventListener("url", handleDeepLink);
    
      return () => {
        subscription.remove(); // Verwijder de listener wanneer de component wordt ontmanteld
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
