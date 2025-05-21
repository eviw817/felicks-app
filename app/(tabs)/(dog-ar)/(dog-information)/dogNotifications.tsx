import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../../../lib/supabase";

export default function UserPermissions() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const soundAnim = useRef(new Animated.Value(1)).current;
  const cameraAnim = useRef(new Animated.Value(1)).current;
  const notificationAnim = useRef(new Animated.Value(1)).current;

  const { petId } = useLocalSearchParams();

  const [dogName, setDogName] = React.useState("");

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

  // Animate toggle press
  const animateToggle = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Toggle handlers
  const toggleSoundSwitch = () => {
    animateToggle(soundAnim);
    setIsSoundEnabled((prev) => !prev);
  };
  const toggleCameraSwitch = () => {
    animateToggle(cameraAnim);
    setIsCameraEnabled((prev) => !prev);
  };
  const toggleNotificationSwitch = () => {
    animateToggle(notificationAnim);
    setIsNotificationEnabled((prev) => !prev);
  };

  // Load user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setFetchError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setFetchError("Failed to get user info.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("push_notifications, sound_permission, camera_permission")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows found
          setFetchError(error.message);
        } else {
          // If data is missing, default to true
          setIsNotificationEnabled(
            data?.push_notifications !== null && data?.push_notifications !== undefined
              ? data.push_notifications
              : true
          );
          setIsSoundEnabled(
            data?.sound_permission !== null && data?.sound_permission !== undefined
              ? data.sound_permission
              : true
          );
          setIsCameraEnabled(
            data?.camera_permission !== null && data?.camera_permission !== undefined
              ? data.camera_permission
              : true
          );
        }
      } catch (e) {
        setFetchError("Error loading settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setLoading(true);
    setFetchError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setFetchError("Failed to get user info.");
      setLoading(false);
      return;
    }

    const settingsPayload = {
      user_id: user.id,
      push_notifications: isNotificationEnabled,
      sound_permission: isSoundEnabled,
      camera_permission: isCameraEnabled,
    };

    try {
      // Upsert: Insert or update the user settings
      const { error } = await supabase
        .from("user_settings")
        .upsert(settingsPayload, { onConflict: "user_id" });

      if (error) {
        setFetchError(error.message);
        Alert.alert("Error", "Failed to save settings.");
      } else {
        // Navigate forward on success
        router.push(`/dogFeaturesInfo?petId=${petId}`); // replace with your next screen route
      }
    } catch (e) {
      setFetchError("Error saving settings");
      Alert.alert("Error", "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

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
          marginRight: 20,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 64,
            left: 16,
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
            textAlign: "center",
          }}
        >
          Toestemming
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 40,
          }}
        >
          Geef toestemming voor camera, geluid en meldingen.
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 40,
          }}
        >
          Zo kunnen we jou helpen goed voor {dogName || "nog geen naam"} te zorgen!
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 16,
            padding: 20,
            paddingTop: 20,
            paddingBottom: 0,
          }}
        >
          Met deze instellingen kunnen we:
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
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
            -
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingRight: 50,
              lineHeight: 32,
            }}
          >
            {dogName || "nog geen naam"} tot leven brengen in AR
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
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
            -
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingRight: 12,
              lineHeight: 32,
            }}
          >
            Geluid gebruiken voor leuke interacties
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
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
            -
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingRight: 40,
              lineHeight: 32,
            }}
          >
             Je waarschuwen als {dogName || "nog geen naam"} honger heeft, wil spelen of naar buiten moet
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            padding: 20,
            paddingRight: 30,
            paddingTop: 12,
          }}
        >
          Klaar om {dogName || "nog geen naam"} de beste zorg te geven? Zet de schuifjes aan en druk
          op 'Opslaan' om verder te gaan!
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 16,
            padding: 20,
            paddingBottom: 8,
          }}
        >
          Toestemming
        </Text>

        {fetchError ? (
          <Text
            style={{
              color: "red",
              fontFamily: "Nunito",
              paddingHorizontal: 20,
              paddingBottom: 20,
              fontSize: 14,
            }}
          >
            {fetchError}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontSize: 16,
              paddingVertical: 12,
            }}
          >
            Geluid
          </Text>
          <Animated.View style={{ transform: [{ scale: soundAnim }] }}>
            <Switch
              trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
              thumbColor={isSoundEnabled ? "#ececeb" : "#ececeb"}
              onValueChange={toggleSoundSwitch}
              value={isSoundEnabled}
              disabled={loading}
            />
          </Animated.View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontSize: 16,
              paddingVertical: 12,
            }}
          >
            Camera
          </Text>
          <Animated.View style={{ transform: [{ scale: cameraAnim }] }}>
            <Switch
              trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
              thumbColor={isCameraEnabled ? "#ececeb" : "#ececeb"}
              onValueChange={toggleCameraSwitch}
              value={isCameraEnabled}
              disabled={loading}
            />
          </Animated.View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontSize: 16,
              paddingVertical: 12,
            }}
          >
            Meldingen
          </Text>
          <Animated.View style={{ transform: [{ scale: notificationAnim }] }}>
            <Switch
              trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
              thumbColor={isNotificationEnabled ? "#ececeb" : "#ececeb"}
              onValueChange={toggleNotificationSwitch}
              value={isNotificationEnabled}
              disabled={loading}
            />
          </Animated.View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#97B8A5",
            margin: 20,
            borderRadius: 15,
            paddingVertical: 12,
            paddingHorizontal: 20,
            alignItems: "center",
          }}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
            OPSLAAN
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
