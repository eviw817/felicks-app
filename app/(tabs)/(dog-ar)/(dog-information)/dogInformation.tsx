import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase"; // adjust if your path is different
import NavBar from "@/components/NavigationBar";
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

export default function DogInformation() {
  const router = useRouter();
  const navigation = useNavigation()
  const { petId } = useLocalSearchParams();

  const [dogName, setDogName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  React.useEffect(() => {
    console.log("DogInformation petId:", petId); // <-- Debug: log petId here

    if (petId && typeof petId === "string" && petId.length > 0) {
      const fetchDogName = async () => {
        setLoading(true);
        setFetchError("");

        const { data, error } = await supabase
          .from("ar_dog")
          .select("name")
          .eq("id", petId)
          .single();

        console.log("Supabase fetch result:", { data, error }); // <-- Debug: log result

        if (error) {
          console.log("Error fetching dog name:", error.message);
          setFetchError(error.message);
          setDogName("");
        } else {
          setDogName(data?.name || "");
        }

        setLoading(false);
      };

      fetchDogName();
    } else {
      // If petId is invalid or missing
      setLoading(false);
      setFetchError("Ongeldig of ontbrekend petId.");
    }
  }, [petId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFDF9",
        paddingBottom: 140,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          justifyContent: "flex-start",
        }}
      >
        <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 68,
              left: 40,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#183A36" />
          </Pressable>

        <View
          style={{
            top: 1,
            flex: 1,
            marginTop: 40,
            justifyContent: "flex-start",
          }}
        >
          {/* Show loading state */}
          {loading && <Text style={{ padding: 20 }}>Laden...</Text>}

          {/* Show error if any */}
          {fetchError ? (
            <Text style={{ padding: 20, color: "red" }}>
              Fout bij laden naam: {fetchError}
            </Text>
          ) : (
            !loading && (
              <Text
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "bold",
                  fontSize: 20,
                  padding: 20,
                  paddingHorizontal: 80,
                  textAlign: "center",
                }}
              >
                Tijd om voor {dogName || "nog geen naam"} te zorgen!
              </Text>
            )
          )}

          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
            }}
          >
            {dogName || "nog geen naam"} staat te trappelen om jouw nieuwe
            virtuele beste vriend te worden!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 8,
              paddingLeft: 20,
            }}
          >
            Klaar om samen op avontuur te gaan?
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingTop: 0,
            }}
          >
            Met de camera van je telefoon komt {dogName || "nog geen naam"} tot
            leven in AR (Augmented Reality).
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingTop: 0,
            }}
          >
            Neem {dogName || "nog geen naam"} overal mee naartoe en speel met {dogName || "nog geen naam"} alsof die echt bij je
            is.
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 8,
              paddingLeft: 20,
            }}
          >
            Hoe leuk is dat?
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingBottom: 0,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Maar</Text>{" "}
            {dogName || "nog geen naam"} is meer dan alleen een schattige hond.
            Honden kunnen niet zomaar op "pauze" worden gezet.
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingTop: 0,
            }}
          >
            {dogName || "nog geen naam"} laat je zien wat er echt bij een huisdier komt kijken:
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                padding: 20,
                paddingVertical: 10,
                marginTop: 0,
                backgroundColor: "#FFD87E",
                borderRadius: 10,
              }}
            >
              Liefde
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                padding: 20,
                paddingVertical: 10,
                marginTop: 0,
                backgroundColor: "#FFD87E",
                borderRadius: 10,
              }}
            >
              Tijd
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                padding: 20,
                paddingVertical: 10,
                marginTop: 0,
                backgroundColor: "#FFD87E",
                borderRadius: 10,
              }}
            >
              Aandacht
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingTop: 0,
            }}
          >
            Spelen is pas het begin… er valt nog zoveel meer te ontdekken!
          </Text>
          <Link
            style={{
              padding: 12,
              margin: 20,
              paddingHorizontal: 20,
              backgroundColor: "#97B8A5",
              fontWeight: "bold",
              borderRadius: 15,
              textAlign: "center",
            }}
            href={`/dogNotifications?petId=${petId}`}
          >
            DOORGAAN
          </Link>
        </View>
      </ScrollView>
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
