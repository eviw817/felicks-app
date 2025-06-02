import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Pressable
} from "react-native";
import { useRouter, Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import NavBar from "@/components/NavigationBar";
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { supabase } from "@/lib/supabase"; // adjust path if needed
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BaseText from "@/components/BaseText";

export default function DogBreed() {
  const router = useRouter();
  const [dogBreed, setdogBreed] = useState<string | null>(null);
    const navigation = useNavigation()

  const handleBreedSubmit = async () => {
    if (!dogBreed) return;

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("User fetch error:", userError);
      Alert.alert("Fout", "Kon gebruiker niet ophalen.");
      return;
    }

    console.log("User ID:", user.id);
    console.log("Selected breed:", dogBreed);

    try {
      // Check if dog already exists for this user
      const { data: existingDog, error: fetchError } = await supabase
        .from("ar_dog")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 means no rows found, so ignore that error
        console.log("Fetch existing dog error:", fetchError);
        Alert.alert("Fout", "Kon hond niet ophalen.");
        return;
      }

      let dogId = existingDog?.id;

      if (dogId) {
        // Dog exists, update it
        const { data, error } = await supabase
          .from("ar_dog")
          .update({ breed: dogBreed })
          .eq("id", dogId)
          .select()
          .single();

        if (error) {
          console.log("Update error:", error);
          Alert.alert("Kon hond niet bijwerken", error.message);
          return;
        }

        console.log("Update succeeded:", data);
        router.push({ pathname: "/dogName", params: { petId: data.id } });
      } else {
        // Dog does not exist, insert new
        const { data, error } = await supabase
          .from("ar_dog")
          .insert({ user_id: user.id, breed: dogBreed })
          .select()
          .single();

        if (error) {
          console.log("Insert error:", error);
          Alert.alert("Kon hond niet opslaan", error.message);
          return;
        }

        console.log("Insert succeeded:", data);
        router.push({ pathname: "/dogName", params: { petId: data.id } });
      }
    } catch (err) {
      console.log("Caught error:", err);
      const message = err instanceof Error ? err.message : "Onbekende fout";
      Alert.alert("Kon hond niet opslaan", message);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", backgroundColor: "#FFFDF9", paddingTop: 100, }}
    >
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
      <View style={{flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center", 
                    width: "100%",
                    position: "relative", 
                    paddingVertical: 10,}}
        >
           <TouchableOpacity onPress={() => router.push("/dogStart")} style={{position: "absolute", left: 5, top:7,}}>
           <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={{position: "absolute", left: 5, top:7,}} />
          </TouchableOpacity>
          <BaseText style={{ fontSize: 28,
            fontFamily: 'SireniaMedium',
            textAlign: "center",
            marginBottom: 20,}}>
              Virtuele hond
          </BaseText>
      </View>
        <Text style={{ fontFamily: "Nunito", fontSize: 16, marginTop: 20, color: "#183A36", }}>
          Denk aan jouw favoriete hond...
        </Text>
        <Text style={{ fontFamily: "Nunito", fontSize: 16, marginTop: 12,  color: "#183A36", }}>
          Welk ras schiet er als eerste te binnen? Dat wordt jouw virtuele
          maatje!
        </Text>
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#97B8A5",
            marginTop: 20,
          }}
        >
          <Picker
            selectedValue={dogBreed}
            onValueChange={(itemValue) => setdogBreed(itemValue)}
            style={{ height: 56, width: "100%" }}
          >
            <Picker.Item label="Selecteer een optie" value={null} />
            {/* <Picker.Item label="Engelse cocker spaniël" value="engelse cocker spaniël" />
            <Picker.Item label="Golden retriever" value="golden retriever" />
            <Picker.Item label="Witte zwitserse herder" value="witte zwitserse herder" />
            <Picker.Item label="Border collie" value="border collie" />
            <Picker.Item label="Jack russel" value="jack russel" /> */}
            <Picker.Item label="Labrador" value="labrador" />
          </Picker>
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleBreedSubmit}
            disabled={!dogBreed}
            style={{
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
              opacity: !dogBreed ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "#183A36",
                textAlign: "center",
              }}
            >
              DOORGAAN
            </Text>
          </TouchableOpacity>
      </View>
      </View>
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
    </SafeAreaView>
  );
}
