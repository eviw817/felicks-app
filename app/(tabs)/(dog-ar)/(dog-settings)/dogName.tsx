import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BaseText from "@/components/BaseText";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

export default function DogName() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const { petId } = useLocalSearchParams();
  const [text, onChangeText] = React.useState("");
  const [dogBreed, setDogBreed] = React.useState<string>("");
  const [dogName, setDogName] = React.useState<string>("");
  const navigation = useNavigation();

  if (!fontsLoaded) return <View />;

  React.useEffect(() => {
    if (petId && typeof petId === "string" && petId.length > 0) {
      const fetchDogData = async () => {
        const { data, error } = await supabase
          .from("ar_dog")
          .select("breed, name")
          .eq("id", petId)
          .single();

        if (error) {
          return;
        }

        setDogBreed(data?.breed || "");
        setDogName(data?.name || "");
        onChangeText(data?.name || "");
      };

      fetchDogData();
    }
  }, [petId]);

  const handleContinuePress = async () => {
    if (!text.trim()) return;

    if (!petId || typeof petId !== "string") {
      Alert.alert("Fout", "Pet ID ontbreekt of is ongeldig.");
      return;
    }

    const { error } = await supabase
      .from("ar_dog")
      .update({ name: text.trim() })
      .eq("id", petId);

    if (error) {
      Alert.alert("Fout", "Naam kon niet opgeslagen worden.");
      return;
    }

    setDogName(text.trim());
    router.push(`/dogInformation?petId=${petId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push(`/dogBreed?petId=${petId}`)}
          style={styles.backButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
        </TouchableOpacity>
        <BaseText style={styles.headerTitle}>Virtuele hond</BaseText>
      </View>

      <Text style={styles.congrats}>Gefeliciteerd!</Text>
      <Text style={styles.intro}>
        Je hebt net een {dogBreed || "hond"} toegevoegd aan je gezin. Tijd voor
        een naam!
      </Text>
      <Text style={styles.label}>Naam</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="#183A36"
          onChangeText={onChangeText}
          value={text}
          placeholder="Geef je viervoeter een naam"
        />
      </View>

      <TouchableOpacity
        onPress={handleContinuePress}
        disabled={text.trim().length === 0}
        style={[
          styles.saveButton,
          { opacity: text.trim().length > 0 ? 1 : 0.5 },
        ]}
      >
        <Text style={styles.saveButtonText}>OPSLAAN</Text>
      </TouchableOpacity>

      <View style={styles.navbarWrapper}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    position: "relative",
    paddingTop: 80,
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
    left: 20,
    top: 7,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    textAlign: "center",
    marginBottom: 20,
  },
  congrats: {
    fontFamily: "NunitoBold",
    fontSize: 20,
    padding: 20,
    color: "#183A36",
  },
  intro: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    padding: 20,
    paddingTop: 12,
    color: "#183A36",
  },
  label: {
    fontFamily: "NunitoBold",
    fontSize: 18,
    padding: 20,
    paddingTop: 16,
    paddingBottom: 0,
    color: "#183A36",
  },
  inputWrapper: {
    margin: 20,
    marginTop: 8,
    backgroundColor: "#FFFDF9",
    borderRadius: 10,
    borderColor: "#183A36",
    borderWidth: 1,
  },
  textInput: {
    height: 20,
    margin: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#183A36",
  },
  saveButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginLeft: 20,
    width: "90%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "#183A36",
    fontSize: 16,
    fontFamily: "NunitoBold",
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
