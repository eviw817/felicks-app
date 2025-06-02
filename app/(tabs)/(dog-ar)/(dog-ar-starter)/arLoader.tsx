import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase"; // adjust if your path is different

export default function Index() {
  const router = useRouter();

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

  function capitalizeFirstLetter(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/arStart?petId=${petId}`);
    }, 4700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFDF9",
      }}
    >
      <LottieView
        source={require("@/assets/animations/loader.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
        speed={2}
      />
      <Text
        style={{
          fontFamily: "Nunito",
          fontWeight: "bold",
          fontSize: 24,
          padding: 20,
          textAlign: "center",
        }}
      >
        {capitalizeFirstLetter(dogName || "nog geen naam")} wordt op jouw profiel ontworpen
      </Text>
    </SafeAreaView>
  );
}
