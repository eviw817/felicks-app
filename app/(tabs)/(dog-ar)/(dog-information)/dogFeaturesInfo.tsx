import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams  } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { supabase } from '../../../../lib/supabase'; // adjust if your path is different

export default function DogFeature() {
  const router = useRouter();

  const { petId } = useLocalSearchParams();

  const [dogName, setDogName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  React.useEffect(() => {
    console.log('DogInformation petId:', petId);  // <-- Debug: log petId here

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
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 64,
            left: 20,
          }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 20,
            padding: 20,
            paddingHorizontal: 60,
            textAlign: "center",
          }}
        >Welkom bij jouw virtuele hond, {dogName || "nog geen naam"}!
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 16,
            padding: 20,
            paddingRight: 40,
            marginRight: 10,
          }}
        >
          Leer hoe je voor hem zorgt en hem blij houdt:
        </Text>
        <View
        style={{
          marginRight: 10,
        }}>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
            }}
          >
            1. Navigatie:
          </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 40,
                marginLeft: 20,
                paddingHorizontal: 20,
              }}
            >
              Tik op Home om terug te keren naar de start.
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 12,
                marginRight: 10,
                marginLeft: 20,
                paddingHorizontal: 20,
              }}
            >
              Onderaan vind je opties om {dogName || "nog geen naam"} te voeren, spelen, wandelen en hem naar het toilet te laten gaan.
            </Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
            }}
          >
            2. Meldingen:
          </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 20,
                marginRight: 20,
                marginLeft: 20,
                paddingHorizontal: 20,
              }}
            >
              Je krijgt een seintje als {dogName || "nog geen naam"} honger heeft of naar buiten wil. 
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 12,
                marginRight: 20,
                marginLeft: 20,
                paddingHorizontal: 20,
              }}
            >
              Goede zorgen = blije {dogName || "nog geen naam"}!
            </Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
            }}
          >
            3. Realistisch & interactief:
          </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 8,
                paddingHorizontal: 20,
                marginRight: 20,
                marginLeft: 20,
              }}
            >
              {dogName || "nog geen naam"} reageert op jouw aandacht. Verzorg je hem goed? Dan straalt hij. Vergeet je hem? 
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 40,
                paddingHorizontal: 20,
                marginRight: 20,
                marginLeft: 20,
              }}
            >
              Dan wordt hij verdrietig.
            </Text>
        </View>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 16,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
          }}
        >
          Wil je stoppen? 
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
          }}
        >
          Dat kan via de instellingen – maar wie laat nou zo’n schatje achter? 
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 16,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
          }}
        >
          Klaar voor jullie avontuur?
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
          }}
        >
          Druk op de knop hieronder en ontmoet {dogName || "nog geen naam"}! 
        </Text>
        <Link
          style={{
            padding: 12,
            paddingHorizontal: 4,
            margin: 20,
            marginRight: 20,
            backgroundColor: "#97B8A5",
            fontWeight: "bold",
            borderRadius: 15,
            textAlign: "center",
          }}
          href={`/arLoader?petId=${petId}`}
        >
          MAAK KENNIS MET JE NIEUWE VRIENDJE
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
