import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
// import { supabase } from "../../lib/supabase";
// import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons";


const SendHelpScreen = () => {
      const router = useRouter();
  
    return (
        <View style={styles.container} >
             <Text style={styles.title}>Je vraag is verzonden.</Text>
             <Text style={styles.subtitle}>We sturen je antwoord zo snel mogelijk via mail. De mail kan altijd in je spam terecht komen,
                gelieve ook deze te controleren. 
            </Text>
            <TouchableOpacity style={styles.submitButton} onPress={() => router.push("../help")} >
                <Text style={styles.submitText}>TERUG</Text>
            </TouchableOpacity>
          
      </View>
    );
   
  };

  const styles = StyleSheet.create({
     container: { 
        flex: 1,
        alignItems: 'center',
        justifyContent: "center", 
        padding: 20,
        backgroundColor: '#FFFDF9',
        fontFamily: 'Nunito'
    },
    title: {
        fontSize: 30,
        fontWeight: "semibold",
        color: '#183A36',
        marginBottom: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#183A36',
        marginBottom: 30,
        paddingHorizontal: 30, 
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
  
  export default SendHelpScreen;