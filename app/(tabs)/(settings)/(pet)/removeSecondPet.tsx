import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";
import { supabase } from "@/lib/supabase"; // ✅ Import Supabase

const Remove2PetScreen = () => {
  const [petName, setPetName] = useState("");
  const router = useRouter();

  const handleDeletePet = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        console.error("No valid session:", sessionError);
        Alert.alert("Fout", "Je bent niet ingelogd.");
        return;
      }

      const { error: deleteError } = await supabase
        .from("ar_dog")
        .delete()
        .eq("user_id", session.user.id);

      if (deleteError) {
        console.error("Failed to delete dog:", deleteError);
        Alert.alert("Fout", "Het verwijderen is mislukt.");
        return;
      }

      Alert.alert("Gelukt", "Je hondje is verwijderd.");
      router.push("/settings"); // ✅ Navigate after delete
    } catch (err) {
      console.error("Unexpected error deleting dog:", err);
      Alert.alert("Fout", "Er is een onverwachte fout opgetreden.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
        </TouchableOpacity>
        <BaseText style={styles.title}>Huisdier verwijderen</BaseText>
      </View>
      <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.image} />
      <Text style={styles.label}>Ben je zeker dat je je huisdiertje wilt verwijderen?</Text>
      <TouchableOpacity style={styles.saveButton} onPress={() => router.push("/pet")}>
        <Text style={styles.saveButtonText}>Neen, ik wil mijn hondje behouden</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nobutton} onPress={handleDeletePet}>
        <Text style={styles.saveButtonText}>Ja, ik wil mijn hondje verwijderen</Text>
      </TouchableOpacity>
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
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
    fontSize: 28,
    fontFamily: 'SireniaMedium',
    textAlign: "center",
    marginBottom: 20,
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
    textTransform: "uppercase",
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: 7,
  },
  nobutton: {
    borderWidth: 2,
    borderColor: "#97B8A5",
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  }
});

export default Remove2PetScreen;
