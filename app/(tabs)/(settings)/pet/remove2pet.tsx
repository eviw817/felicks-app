import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";

const Remove2PetScreen = () => {
  const [petName, setPetName] = useState("");;
  const router = useRouter();

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("../settings")} style={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
            </TouchableOpacity>
            <Text style={styles.title}>Huisdier verwijderen</Text>
        </View>
      <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.image} />
      <Text style={styles.label}>Ben je zeker dat je je huisdiertje wilt verwijderen?</Text>
      <TouchableOpacity style={styles.saveButton} onPress={() => router.push("../pet/pet")}>
        <Text style={styles.saveButtonText}>Neen, ik wil mijn hondje behouden</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={() => router.push("../settings")}>
        <Text style={styles.saveButtonText}>Ja, ik wil mijn hondje verwijderen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
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
    marginBottom: 20,
    textAlign: "center",
},
  image: {
    width: 110,
    height: 110,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: "#E0E0E0",
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
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#183A36",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  backButton: {
    position: "absolute",
    left: 5,
    top:7,
  },
});

export default Remove2PetScreen;
