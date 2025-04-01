import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase"; 
import { Session } from "@supabase/supabase-js"; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const HelpcentrumScreen = () => {
  const router = useRouter();
  const [help, setHelp] = useState("");  // State voor de hulptekst
  const [loading, setLoading] = useState(false); // Laadsymbool om in de gaten te houden of het verzoek bezig is

  const handleSubmit = async () => {
    if (help.trim() === "") {
      Alert.alert("Fout", "Voer een probleem in voordat je het verstuurt.");
      return;
    }

    setLoading(true);

    try {

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        Alert.alert("Fout", "Kan sessie niet ophalen.");
        setLoading(false);
        return;
      }

      if (!session || !session.user?.email) {
        Alert.alert("Fout", "Er is geen gebruiker ingelogd.");
        setLoading(false);
        return;
      }

      const email = session.user.email;

      const { data, error } = await supabase
        .from('hulpQuestions')
        .insert([
          {
            question: help, 
            email: email,  
            status: 'open',  
          }
        ]);

      if (error) {
        throw error;
      }

      setHelp("");
      setLoading(false);
      
      router.push("/settings/hulp/sendhelp");

    } catch (error) {
      Alert.alert("Fout", "Er is een fout opgetreden bij het verzenden van het probleem.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings/hulp/hulp")} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} />
        </TouchableOpacity>
        <Text style={styles.title}>Helpcentrum</Text>
      </View>

      <Text style={styles.subtitle}>Waar kunnen wij u mee helpen?</Text>
      <TextInput
        style={styles.input}
        placeholder="Typ hier uw probleem..."
        placeholderTextColor="#aaa"
        value={help} 
        onChangeText={setHelp}  
        multiline={true}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}  
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? 'VERZENDEN...' : 'VERSTUUR'}</Text>
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
    fontFamily: 'Nunito'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    width: "100%",
    position: "relative", 
    paddingVertical: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: '#183A36',
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 23,
    fontWeight: "semibold",
    color: '#183A36',
    textAlign: "left",
  },
  backButton: {
    position: "absolute",
    left: 5,
    top:7,
  },
  input: {
    marginTop: 30,
    width: "100%",
    height: 200,
    borderColor: "#183A36",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    minHeight: 100, 
    maxHeight: 300
  },
  submitButton: {
    backgroundColor: '#97B8A5',
    paddingVertical: 15,
    borderRadius: 20, 
    marginTop: 30,
    marginBottom: 20,
    width: '97%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitText: {
    color: '#183A36',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HelpcentrumScreen;
