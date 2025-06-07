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
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase"; // adjust if your path is different
import NavBar from "@/components/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useFonts } from "expo-font";

export default function DogFeature() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const navigation = useNavigation();

  const { petId } = useLocalSearchParams();

  const [dogName, setDogName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  if (!fontsLoaded) {
    return <View />;
  }

  React.useEffect(() => {

    if (petId && typeof petId === "string" && petId.length > 0) {
      const fetchDogName = async () => {
        setLoading(true);
        setFetchError("");

        const { data, error } = await supabase
          .from("ar_dog")
          .select("name")
          .eq("id", petId)
          .single();

        if (error) {
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
        paddingBottom: 80,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/dogNotifications?petId=${petId}`)}
          style={{
            position: "absolute",
            top: 64,
            left: 20,
            zIndex: 10,
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
        </TouchableOpacity>
        <Text
          style={{
             color: "#183A36",
              fontSize: 28,
              fontFamily: 'SireniaMedium',
            padding: 20,
            paddingHorizontal: 60,
            textAlign: "center",
          }}
        >
          Welkom bij jouw virtuele hond, {dogName || "nog geen naam"}!
        </Text>
        <Text
          style={{
            fontFamily: "NunitoBold",
            fontSize: 16,
            padding: 20,
            paddingRight: 40,
            marginRight: 10,
            color: "#183A36",
          }}
        >
          Leer hoe je voor hem zorgt en hem blij houdt:
        </Text>
        <View
          style={{
            marginRight: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "NunitoBold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
              color: "#183A36",
            }}
          >
            1. Navigatie:
          </Text>
          <Text
            style={{
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingRight: 40,
              marginLeft: 20,
              paddingHorizontal: 20,
              color: "#183A36",
            }}
          >
            Tik op Home om terug te keren naar de start.
          </Text>
          <Text
            style={{
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingRight: 12,
              marginRight: 10,
              marginLeft: 20,
              paddingHorizontal: 20,
              color: "#183A36",
            }}
          >
            Onderaan vind je opties om {dogName || "nog geen naam"} te voeren,
            spelen, wandelen en hem naar het toilet te laten gaan.
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "NunitoBold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
              color: "#183A36",
            }}
          >
            2. Meldingen:
          </Text>
          <Text
            style={{
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingRight: 20,
              marginRight: 20,
              marginLeft: 20,
              paddingHorizontal: 20,
              color: "#183A36",
            }}
          >
            Je krijgt een seintje als {dogName || "nog geen naam"} honger heeft
            of naar buiten wil.
          </Text>
          <Text
            style={{
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingRight: 12,
              marginRight: 20,
              marginLeft: 20,
              paddingHorizontal: 20,
              color: "#183A36",
            }}
          >
            Goede zorgen = blije {dogName || "nog geen naam"}!
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "NunitoBold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
              color: "#183A36",
            }}
          >
            3. Realistisch & interactief:
          </Text>
          <Text
            style={{
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingRight: 8,
              paddingHorizontal: 20,
              marginRight: 20,
              marginLeft: 20,
              color: "#183A36",
            }}
          >
            {dogName || "nog geen naam"} reageert op jouw aandacht. Verzorg je
            {dogName || "nog geen naam"} goed? Dan straalt die. Vergeet je{" "}
            {dogName || "nog geen naam"}?
          </Text>
          <Text
            style={{
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingRight: 40,
              paddingHorizontal: 20,
              marginRight: 20,
              marginLeft: 20,
              color: "#183A36",
            }}
          >
            Dan wordt die verdrietig.
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "NunitoBold",
            fontSize: 16,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
            color: "#183A36",
          }}
        >
          Wil je stoppen?
        </Text>
        <Text
          style={{
            fontFamily: "NunitoRegular",
            fontSize: 16,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
            color: "#183A36",
          }}
        >
          Dat kan via de instellingen – maar wie laat nou zo’n schatje achter?
        </Text>
        <Text
          style={{
            fontFamily: "NunitoBold",
            fontSize: 16,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
            color: "#183A36",
          }}
        >
          Klaar voor jullie avontuur?
        </Text>
        <Text
          style={{
            fontFamily: "NunitoRegular",
            fontSize: 16,
            paddingLeft: 20,
            paddingRight: 40,
            marginRight: 10,
            color: "#183A36",
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
             fontFamily: "NunitoBold",
            fontSize: 16,
            borderRadius: 15,
            textAlign: "center",
            color: "#183A36",
          }}
          href={`/arLoader?petId=${petId}`}
        >
          MAAK KENNIS MET JE NIEUWE VRIENDJE
        </Link>
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
