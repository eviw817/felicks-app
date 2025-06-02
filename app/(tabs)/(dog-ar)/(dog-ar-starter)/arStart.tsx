import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
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
      setLoading(false);
      setFetchError("Ongeldig of ontbrekend petId.");
    }
  }, [petId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFDF9",
      }}
    >
      <ScrollView>
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
            flex: 1,
            paddingTop: 44,
            paddingBottom: 100,
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
            Welkom {dogName || "nog geen naam"}
          </Text>
          <Image
            source={require("@/assets/images/ARDog.png")}
            style={{
              width: 240,
              height: 240,
              alignSelf: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              padding: 20,
              paddingBottom: 0,
            }}
          >
            Dit is {dogName || "nog geen naam"}, jouw nieuwe hondenvriend!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingVertical: 0,
            }}
          >
            Vanaf nu ben jij verantwoordelijk voor hun zorg en geluk.
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingVertical: 0,
            }}
          >
            Leer stap voor stap hoe je de beste hondenbaas wordt.
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              padding: 20,
              paddingBottom: 0,
            }}
          >
            Klaar om te beginnen?
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 20,
              padding: 20,
              paddingTop: 0,
            }}
          >
            Let's go!
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
            href={`/arInformation?petId=${petId}`}
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
