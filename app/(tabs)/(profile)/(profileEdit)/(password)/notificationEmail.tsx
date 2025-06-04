import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import BaseText from "@/components/BaseText";

const NotificationEmailScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;

      try {
        const parsedUrl = new URL(url);
        const hashParams = new URLSearchParams(parsedUrl.hash.replace("#", ""));

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          await SecureStore.setItemAsync("access_token", accessToken);
          await SecureStore.setItemAsync("refresh_token", refreshToken);

          router.replace("/newPassword");
        } else {
          Alert.alert("Fout", "De benodigde gegevens ontbreken in de link.");
        }
      } catch (error) {
        console.error("Fout bij URL-verwerking:", error);
        Alert.alert("Fout", "De link is ongeldig.");
      }
    };

    // controleer bij opstart
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // luister naar toekomstige deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove(); // correcte cleanup
    };
  }, []);

  return (
    <View style={styles.container}>
      <BaseText style={styles.title}>Verzonden e-mail</BaseText>
      <Text style={styles.subtitle}>
        Er is een e-mail verzonden naar het opgegeven e-mailadres. Controleer je
        inbox om je wachtwoord te resetten.
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
    textAlign: "center",
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
    color: "#183A36",
    marginBottom: 50,
  },
});

export default NotificationEmailScreen;
