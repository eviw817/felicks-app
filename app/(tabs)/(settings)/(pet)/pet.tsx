import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";

const EditPetScreen = () => {
  const router = useRouter();
  const [petId, setPetId] = useState<string | null>(null);
  const navigation = useNavigation();

  const [dogBreed, setDogBreed] = useState<string>("");
  const [dogName, setDogName] = useState<string>("");

  useEffect(() => {
  const fetchDogDataForUser = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return;
    }

    const { data, error } = await supabase
      .from("ar_dog")
      .select("id, breed, name")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return;
    }

    setDogBreed(data?.breed || "Labrador");
    setDogName(data?.name || "");
    setPetId(data?.id || null);

    // Set petId from the fetched dog's ID, in case it's needed later
    if (data?.id) {
      router.setParams({ petId: data.id });
    }
  };

  fetchDogDataForUser();
}, []);

  const handleContinuePress = async () => {
    if (!dogName.trim()) return;

    if (!petId || typeof petId !== "string") {
      Alert.alert("Fout", "Pet ID ontbreekt of is ongeldig.");
      return;
    }

    const { error } = await supabase
      .from("ar_dog")
      .update({ name: dogName.trim() })
      .eq("id", petId);

    if (error) {
      Alert.alert("Fout", "Naam kon niet opgeslagen worden.");
      return;
    }
    router.push(`/dogInformation?petId=${petId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          alignItems: "center",
          paddingTop: 60,
          padding: 20,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={styles.backButton}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={30}
              color={"#183A36"}
              style={styles.backButton}
            />
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
            dogName.trim() !== "" ? styles.focusedInput : styles.unfocusedInput,
          ]}
          placeholder={dogName || "Voornaam"}
          placeholderTextColor="rgba(151, 184, 165, 0.5)"
          keyboardType="default"
          value={dogName}
          onChangeText={setDogName}
        />
        <View style={styles.datePickerContainer}>
          <Picker
            selectedValue={dogBreed}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setDogBreed(itemValue)}
          >
            <Picker.Item label="Labrador" value="Labrador" />
            {/* <Picker.Item label="Engelse cocker spaniël" value="engelse cocker spaniël" />
            <Picker.Item label="Golden retriever" value="golden retriever" />
            <Picker.Item label="Witte zwitserse herder" value="witte zwitserse herder" />
            <Picker.Item label="Border collie" value="border collie" />
            <Picker.Item label="Jack russel" value="jack russel" /> */}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleContinuePress}
        >
          <Text style={styles.saveButtonText}>OPSLAAN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/removePet")}>
          <Text style={styles.deleteText}>Huisdier verwijderen</Text>
        </TouchableOpacity>
      </ScrollView>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
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
    fontFamily: "SireniaMedium",
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
    marginBottom: 25,
    fontSize: 16,
    color: "#183A36",
    paddingLeft: 15,
  },
  focusedInput: {
    borderBottomColor: "#183A36",
  },
  unfocusedInput: {
    borderBottomColor: "#97B8A5",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 50,
    borderColor: "#97B8A5",
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 15,
    fontWeight: "bold",
    fontSize: 16,
  },
  picker: {
    width: "100%",
    height: 55,
  },
  pickerItem: {
    fontSize: 16,
    color: "black",
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
    top: 7,
  },
});

export default EditPetScreen;
