"use client";

import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";
import BaseText from "@/components/BaseText";
import NavBar from "@/components/NavigationBar";

export default function AdoptionChoice() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const router = useRouter();
  const [isPersonalityProfileComplete, setIsPersonalityProfileComplete] =
    useState<boolean | null>(null);
  const [isBreedProfileComplete, setIsBreedProfileComplete] = useState(false);

  useEffect(() => {
    const checkPersonalityProfileCompletion = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user?.id) {
          setIsPersonalityProfileComplete(false);
          return;
        }

        const { data, error } = await supabase
          .from("adoption_dog_preferences")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error || !data) {
          setIsPersonalityProfileComplete(false);
          return;
        }

        const isComplete = Object.values(data).every(
          (value) => value !== null && value !== "" && value !== undefined
        );

        setIsPersonalityProfileComplete(isComplete);
      } catch (err) {
        console.error("Error checking personality profile data:", err);
        setIsPersonalityProfileComplete(false);
      }
    };

    const checkBreedProfileCompletion = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user?.id) {
          return;
        }

        const { data, error } = await supabase
          .from("adoption_profiles")
          .select("shedding")
          .eq("user_id", session.user.id)
          .single();

        if (error || !data) {
          setIsBreedProfileComplete(false);
          return;
        }

        const allFieldsFilled = Object.values(data).every(
          (value) => value !== null && value !== "" && value !== undefined
        );

        setIsBreedProfileComplete(allFieldsFilled);
      } catch (err) {
        console.error("Error checking breed profile data:", err);
        setIsBreedProfileComplete(false);
      }
    };

    checkPersonalityProfileCompletion();
    checkBreedProfileCompletion();
  }, []);

  const handlePressPersonality = () => {
    if (isPersonalityProfileComplete) {
      router.push("/matching");
    } else {
      router.push("/personalityTraits");
    }
  };

  const handlePressBreed = () => {
    if (isBreedProfileComplete) {
      router.push("/adoptionprofileResults");
    } else {
      router.push("/missingAdoptionProfile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <BaseText style={styles.title}>Adoptie</BaseText>
      </View>

      <BaseText style={styles.question}>
        Wil je een hond die meer op jouw persoonlijkheid gebaseerd is of ga je
        liever voor een bepaald ras?
      </BaseText>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={handlePressPersonality}
      >
        <BaseText style={styles.optionText}>PERSOONLIJKHEID</BaseText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handlePressBreed}>
        <BaseText style={styles.optionText}>RAS</BaseText>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  question: {
    fontSize: 18,
    color: "#183A36",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: "NunitoBold",
    textAlign: "left",
  },
  optionButton: {
    borderColor: "#97B8A5",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#183A36",
    fontFamily: "NunitoBold",
    textTransform: "uppercase",
  },
   title: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    textAlign: "center",
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    paddingVertical: 10,
  },
  settingsicon: {
    position: "absolute",
    right: 15,
    top: 12,
  },
});
