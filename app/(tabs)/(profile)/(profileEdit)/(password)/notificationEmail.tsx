import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";  
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import BaseText from "@/components/BaseText";

const NotficationEmailScreen = () => {
    const router = useRouter();
  
    useEffect(() => {
      const handleDeepLink = async (event: { url: string }) => {
        const { url } = event;
          if (url) {
            try {
              const parsedUrl = new URL(url);
              const hashParams = new URLSearchParams(parsedUrl.hash.replace('#', ''));

              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');

              if (accessToken && refreshToken) {
                await SecureStore.setItemAsync('access_token', accessToken);
                await SecureStore.setItemAsync('refresh_token', refreshToken);

                router.replace(`/newPassword`);
             } else {
               // Alert.alert("Fout", "Tokens ontbreken in de link.");
             }
           } catch (error) {
              console.error("Fout bij URL verwerking:", error);
              Alert.alert("Fout", "De link is ongeldig.");
          }
        }
    
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
      <BaseText style={styles.title}>Verzonden e-mail</BaseText>

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
     fontSize: 28,
    fontFamily: 'SireniaMedium',
    textAlign: "center",
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
