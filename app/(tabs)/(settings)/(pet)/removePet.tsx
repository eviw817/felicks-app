import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";

const RemovePetScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("../settings")} style={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Verwijder je huisdier</Text>
                </View>
      <Text style={styles.label}>Het spijt ons dat je het huisdier wilt verwijderen, maar we hopen dat je naar een levend huisdier bent gegaan. Houd er rekening mee dat het permanent wordt verwijderd en dat je de hond opnieuw moet aanmaken. 
      </Text>
     
      <TouchableOpacity style={styles.saveButton} onPress={() => router.push("../removeSecondPet")}>
        <Text style={styles.saveButtonText}>VERWIJDER HUISDIER</Text>
      </TouchableOpacity>
      {/* Fixed navbar onderaan scherm */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#FFFDF9",
    padding: 20,
    alignItems: "center",

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    width: "100%",
    position: "relative", 
    paddingVertical: 10,
  },
title: {
    fontSize: 23,
    fontWeight: "bold",
    color: '#183A36',
    marginBottom: 190,
    textAlign: "center",
},

  label: {
    color: '#183A36',
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 16,
    marginBottom: 25,
  },
 
  saveButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 75,
  },
  saveButtonText: {
    color: "#183A36",
    fontSize: 16,
    fontWeight: "bold",
  },

  backButton: {
    position: "absolute",
    left: 5,
    top:7,
  },
});

export default RemovePetScreen;
