// app/adoptionprofile/adoption_profile_loading.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAdoptionProfile } from "../../context/AdoptionProfileContext";

function LoadingScreen() {
  const router = useRouter();
  const { profileData, resetProfile } = useAdoptionProfile();

  useEffect(() => {
    const saveProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Fout bij ophalen gebruiker:", userError);
        return;
      }

      console.log("Ingelogde user:", user.id);

      // ✅ Profieldata klaarmaken
      const formattedData = {
        user_id: user.id,
        living_type: profileData.housingType,
        has_garden:
          profileData.garden === "ja_omheind" ||
          profileData.garden === "ja_niet_omheind",
        garden_enclosed: profileData.garden === "ja_omheind",
        environment: profileData.environment,
        household: profileData.livingSituation,
        has_children: profileData.hasChildren === "ja",
        children_ages: Array.isArray(profileData.childrenAges)
          ? profileData.childrenAges
          : [],
        has_other_pets: profileData.hasPets === "ja",
        other_pets: Array.isArray(profileData.pets) ? profileData.pets : [],
        work_hours: profileData.workHours,
        work_from_home: profileData.workFromHome,
        pet_time: profileData.petTime,
        daily_time_with_dog: profileData.timeWithDog,
        weekend_routine: profileData.weekendRoutine,
        experience: profileData.experience,
        experience_pets: Array.isArray(profileData.petsOwned)
          ? profileData.petsOwned
          : [],
        preferred_age: profileData.preferredAge,
        preferences: Array.isArray(profileData.preferences)
          ? profileData.preferences
          : [],
        preferred_size: profileData.preferredSize,
        activity_level: profileData.activity_level,
        breed_pref: profileData.breed_pref,
        motivation: profileData.motivation,
      };

      // ✅ Upsert naar Supabase: als user_id al bestaat ➔ update, anders ➔ insert
      const { error: upsertError } = await supabase
        .from("adoption_profiles")
        .upsert(formattedData, { onConflict: "user_id" });

      if (upsertError) {
        console.error("Fout bij opslaan profiel:", upsertError);
        Alert.alert(
          "Fout",
          "Er is iets misgegaan bij het opslaan van je adoptieprofiel."
        );
        return;
      }

      console.log("Adoptieprofiel succesvol opgeslagen!");
      resetProfile();
      router.push("/suitable_dogs_1");
    };

    saveProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adoptieprofiel</Text>
      <ActivityIndicator size="large" color="#183A36" style={styles.spinner} />
      <Text style={styles.loadingText}>
        Even geduld…{"\n"}We zoeken jouw perfecte match!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCF9",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "#183A36",
    fontFamily: "nunitoBold",
    position: "absolute",
    top: 60,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#183A36",
    textAlign: "center",
    fontFamily: "nunitoRegular",
  },
});

export default LoadingScreen;
