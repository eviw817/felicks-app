import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";
import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";

export default function DogBreed() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const [dogBreed, setdogBreed] = useState<string | null>(null);

  if (!fontsLoaded) {
    return <View />;
  }

  const handleBreedSubmit = async () => {
    if (!dogBreed) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Fout", "Kon gebruiker niet ophalen.");
      return;
    }

    try {
      const { data: existingDog, error: fetchError } = await supabase
        .from("ar_dog")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        Alert.alert("Fout", "Kon hond niet ophalen.");
        return;
      }

      let dogId = existingDog?.id;

      if (dogId) {
        const { data, error } = await supabase
          .from("ar_dog")
          .update({ breed: dogBreed })
          .eq("id", dogId)
          .select()
          .single();

        if (error) {
          Alert.alert("Kon hond niet bijwerken", error.message);
          return;
        }

        router.push({ pathname: "/dogName", params: { petId: data.id } });
      } else {
        const { data, error } = await supabase
          .from("ar_dog")
          .insert({ user_id: user.id, breed: dogBreed })
          .select()
          .single();

        if (error) {
          Alert.alert("Kon hond niet opslaan", error.message);
          return;
        }

        router.push({ pathname: "/dogName", params: { petId: data.id } });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Onbekende fout";
      Alert.alert("Kon hond niet opslaan", message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/dogStart")}
            style={styles.backButton}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
          </TouchableOpacity>
          <BaseText style={styles.title}>Virtuele hond</BaseText>
        </View>

        <Text style={styles.subtext}>Denk aan jouw favoriete hond...</Text>
        <Text style={styles.subtext}>
          Welk ras schiet er als eerste te binnen? Dat wordt jouw virtuele
          maatje!
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={dogBreed}
            onValueChange={(itemValue) => setdogBreed(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecteer een optie" value={null} />
            <Picker.Item label="Labrador" value="labrador" />
          </Picker>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleBreedSubmit}
            disabled={!dogBreed}
            style={[styles.button, !dogBreed && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>DOORGAAN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navbar}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    paddingTop: 80,
  },
  content: {
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    paddingVertical: 4,
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: 7,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    textAlign: "center",
    marginBottom: 20,
  },
  subtext: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    marginTop: 12,
    color: "#183A36",
  },
  pickerWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#97B8A5",
    marginTop: 20,
  },
  picker: {
    height: 56,
    width: "100%",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    margin: 20,
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#97B8A5",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: "NunitoBold",
    fontSize: 15,
    color: "#183A36",
    textAlign: "center",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
