import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Pressable
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "@/lib/supabase"; // adjust if your path is different
import NavBar from "@/components/NavigationBar";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BaseText from "@/components/BaseText";
import { useNavigation } from '@react-navigation/native'

export default function DogName() {
  const router = useRouter();
  const { petId } = useLocalSearchParams();
  const [text, onChangeText] = React.useState("");
  const [dogBreed, setDogBreed] = React.useState<string>("");
  const [dogName, setDogName] = React.useState<string>("");
  const navigation = useNavigation()

  React.useEffect(() => {
    if (petId && typeof petId === "string" && petId.length > 0) {
      const fetchDogData = async () => {
        const { data, error } = await supabase
          .from("ar_dog")
          .select("breed, name")
          .eq("id", petId)
          .single();

        if (error) {
          console.log("Error fetching dog data:", error.message);
          return;
        }

        setDogBreed(data?.breed || "");
        setDogName(data?.name || "");
        onChangeText(data?.name || ""); // also fill the input with existing name
      };

      fetchDogData();
    }
  }, [petId]);

  const handleContinuePress = async () => {
    if (!text.trim()) return;

    console.log("Entered name:", text);
    console.log("Updating pet with ID:", petId);

    if (!petId || typeof petId !== "string") {
      Alert.alert("Fout", "Pet ID ontbreekt of is ongeldig.");
      return;
    }

    const { error } = await supabase
      .from("ar_dog")
      .update({ name: text.trim() })
      .eq("id", petId);

    if (error) {
      console.log("Update error:", error.message);
      Alert.alert("Fout", "Naam kon niet opgeslagen worden.");
      return;
    }

    console.log("Name update successful!");
    setDogName(text.trim());

    // ✅ Correct dynamic navigation:
    router.push(`/dogInformation?petId=${petId}`);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFDF9",
        position: "relative",
        paddingTop: 100,
      }}
    >
          <View style={{flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center", 
                          width: "100%",
                          position: "relative", 
                          paddingVertical: 10,}}
              >
                 <TouchableOpacity onPress={() => router.push("/dogStart")} style={{position: "absolute", left: 5, top:7,}}>
                 <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={{position: "absolute", left: 10,top:7,}} />
                </TouchableOpacity>
                <BaseText style={{ fontSize: 28,
                  fontFamily: 'SireniaMedium',
                  textAlign: "center",
                  marginBottom: 20,}}>
                    Virtuele hond
                </BaseText>
            </View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 20,
              padding: 20,
              color: '#183A36'
            }}
          >
            Gefeliciteerd!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingTop: 12,
              color: '#183A36'
            }}
          >
            Je hebt net een {dogBreed || "hond"} toegevoegd aan je gezin. Tijd
            voor een naam!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              padding: 20,
              paddingTop: 16,
              paddingBottom: 0,
              color: '#183A36'
            }}
          >
            Naam
          </Text>
          <View
            style={{
              margin: 20,
              marginTop: 8,
              backgroundColor: "#FFFDF9",
              borderRadius: 10,
              borderColor: "#183A36",
              borderWidth: 1,
            }}
          >
            <TextInput
              style={{
                height: 20,
                margin: 12,
                borderRadius: 10,
                fontSize: 16,
                color: "#183A36",
              }}
              placeholderTextColor="#183A36"
              onChangeText={onChangeText}
              value={text}
              placeholder="Geef je viervoeter een naam"
            />
          </View>
          <TouchableOpacity
            onPress={handleContinuePress}
            disabled={text.trim().length === 0}
            style={{
              opacity: text.trim().length > 0 ? 1 : 0.5,
              backgroundColor: '#97B8A5',
              paddingVertical: 15,
              borderRadius: 20, 
              marginLeft: 20,
              width: '90%',
              alignItems: 'center',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
                  <Text style={{color: '#183A36', fontSize: 16, fontWeight: "bold",}}>OPSLAAN</Text>
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
    </SafeAreaView>
  );
}
