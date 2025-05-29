import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";

const EditPetScreen = () => {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("Golden retriever");
  const [firstnameFocus, setFirstnameFocus] = useState(false);
  const isFirstnameFilled = petName.trim() !== '';
  const router = useRouter();

  return (
    <View style={styles.container}>
        <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/settings")} style={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                    </TouchableOpacity>
                    <BaseText style={styles.title}>Huisdier aanpassen</BaseText>
                </View>
      <Image
                  source={require("@/assets/images/ARDog.png")}
                  style={{
                    alignSelf: "center",
                    marginTop: 20,
                    marginBottom: 20,
                    width: 150,
                    height: 150,
                    borderRadius: 90,
                  }}
                />
      <Text style={styles.label}>Naam</Text>
      <TextInput
        style={[
            styles.input, 
            firstnameFocus || isFirstnameFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="Voornaam"
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        keyboardType="default"
        onFocus={() => setFirstnameFocus(true)} 
        onBlur={() => setFirstnameFocus(false)} 
        value={petName}
        onChangeText={setPetName}
      />
      <View style={styles.datePickerContainer}>
      <Picker
        selectedValue={breed}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => setBreed(itemValue)}
      >
        <Picker.Item label="Labrador" value="Labrador" />
      </Picker>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={() => router.push("/settings")}>
        <Text style={styles.saveButtonText}>OPSLAAN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/removePet")}>
        <Text style={styles.deleteText}>Huisdier verwijderen</Text>
      </TouchableOpacity>
      {/* Fixed navbar onderaan scherm */}
      <View
              style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              }}
          >
              <NavBar />
      </View>
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
    alignSelf: "flex-start",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#97B8A5", 
    marginBottom: 25,
    fontSize: 16,
    color: "#183A36",
    paddingLeft: 15,
  },
  focusedInput: {
    borderBottomColor: '#183A36', 
  },
  unfocusedInput: {
    borderBottomColor: "#97B8A5", 
  },

  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 50,
    borderColor: '#97B8A5', 
    borderWidth: 2, 
    borderRadius: 20, 
    paddingLeft: 15,
    fontWeight: "bold",
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 55,
  },
  pickerItem: {
    fontSize: 16,
    color: "white",
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
  deleteText: {
    fontSize: 16,
    color: "#F18B7E",
    marginBottom: 25,
    alignSelf: "flex-start",
  },
  backButton: {
    position: "absolute",
    left: 5,
    top:7,
  },
});

export default EditPetScreen;
