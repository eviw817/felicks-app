import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase"; // adjust if your path is different
import NavBar from "@/components/NavigationBar";

export default function DogInformation() {
  const router = useRouter();

  const { petId } = useLocalSearchParams();

  const [dogName, setDogName] = React.useState("");
  const [dogBreed, setDogBreed] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  React.useEffect(() => {
    console.log("DogInformation petId:", petId); // Debug

    if (petId && typeof petId === "string" && petId.length > 0) {
      const fetchDogData = async () => {
        setLoading(true);
        setFetchError("");

        const { data, error } = await supabase
          .from("ar_dog")
          .select("name, breed")
          .eq("id", petId)
          .single();

        console.log("Supabase fetch result:", { data, error }); // Debug

        if (error) {
          console.log("Error fetching dog data:", error.message);
          setFetchError(error.message);
          setDogName("");
          setDogBreed("");
        } else {
          setDogName(data?.name || "");
          setDogBreed(data?.breed || "");
        }

        setLoading(false);
      };

      fetchDogData();
    } else {
      // Invalid or missing petId
      setLoading(false);
      setFetchError("Ongeldig of ontbrekend petId.");
      setDogName("");
      setDogBreed("");
    }
  }, [petId]);

  function capitalizeFirstLetter(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFDF9",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          justifyContent: "flex-start",
          paddingBottom: 100,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 68,
            left: 20,
          }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View
          style={{
            top: 1,
            flex: 1,
            marginTop: 4,
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 20,
              padding: 20,
              textAlign: "center",
            }}
          >
            {dogName || "nog geen naam"}
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 20,
              paddingLeft: 20,
              marginRight: 30,
            }}
          >
            Jouw {dogBreed || "hond"} in een notendop:
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 0,
              paddingLeft: 20,
            }}
          >
            Karakter
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingTop: 8,
              paddingRight: 30,
            }}
          >
            {capitalizeFirstLetter(dogBreed || "hond")} zijn vriendelijk,
            zachtaardig en dol op gezelschap. Ze zijn slim, sociaal en werken
            graag samen, perfect voor gezinnen met kinderen en andere dieren.
            Soms een tikkeltje eigenwijs, maar altijd liefdevol en enthousiast!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 0,
              paddingLeft: 20,
            }}
          >
            Aandachtspunten:
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
                lineHeight: 36,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 40,
                lineHeight: 28,
              }}
            >
              Ze houden van eten… misschien iets té veel. Let op hun gewicht!
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
                lineHeight: 36,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 20,
                lineHeight: 28,
              }}
            >
              Bewegen is een must: minstens 30–60 minuten per dag.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
                lineHeight: 36,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 40,
                lineHeight: 28,
              }}
            >
              Nieuwsgierig als ze zijn, snuffelen ze graag, zelfs in de
              vuilnisbak.
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingRight: 30,
            }}
          >
            Een {dogBreed || "hond"} is de ideale gezinshond voor actieve
            baasjes die houden van wandelen, trainen en samen plezier maken.
            Geef je hem de juiste aandacht, dan heb je er een vrolijke vriend
            voor het leven aan!
          </Text>
          <Link
            style={{
              padding: 12,
              margin: 20,
              paddingHorizontal: 20,
              marginRight: 46,
              backgroundColor: "#97B8A5",
              fontWeight: "bold",
              borderRadius: 15,
              textAlign: "center",
            }}
            href={`/demo?petId=${petId}`}
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
