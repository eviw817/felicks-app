import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";  

const NotficationEmailScreen = () => {
    const router = useRouter();
  
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     router.replace("/login/password/new_password"); 
    //   }, 3000);
  
    //   return () => clearTimeout(timer);
    // }, []);
  
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
