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
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function UserPermissions() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const navigation = useNavigation();

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

  if (!fontsLoaded) {
    return <View />;
  }

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
            data?.push_notifications !== null &&
              data?.push_notifications !== undefined
              ? data.push_notifications
              : true
          );
          setIsSoundEnabled(
            data?.sound_permission !== null &&
              data?.sound_permission !== undefined
              ? data.sound_permission
              : true
          );
          setIsCameraEnabled(
            data?.camera_permission !== null &&
              data?.camera_permission !== undefined
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

  const handleSave = async () => {
    if (!isCameraEnabled && !isNotificationEnabled) {
      Alert.alert(
        "Toestemming vereist",
        "U moet minstens camera of meldingen inschakelen om door te gaan."
      );
      return; // Stop saving
    }

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
      const { error } = await supabase
        .from("user_settings")
        .upsert(settingsPayload, { onConflict: "user_id" });

      if (error) {
        setFetchError(error.message);
        Alert.alert("Error", "Failed to save settings.");
      } else {
        router.push(`/dogFeaturesInfo?petId=${petId}`);
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
        paddingBottom: 80,
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
          onPress={() => router.push(`/dogNotifications?petId=${petId}`)}
          style={{
            position: "absolute",
            top: 68,
            left: 40,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "NunitoBold",
            fontSize: 20,
            padding: 20,
            textAlign: "center",
          }}
        >
          Toestemming
        </Text>
        <Text
          style={{
            fontFamily: "NunitoRegular",
            fontSize: 16,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 40,
          }}
        >
          U duidde aan om geen meldingen en camera toe te staan. Wij kunnen
          hierdoor jou niet Cooper maken.
        </Text>
        <Text
          style={{
            fontFamily: "NunitoRegular",
            fontSize: 16,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 40,
          }}
        >
          Als u toch twijfelt kunt hier ook weg gaan via de navigatiebalk.
        </Text>
        <Text
          style={{
            fontFamily: "NunitoBold",
            fontSize: 16,
            padding: 20,
            paddingBottom: 8,
          }}
        >
          Toestemmingen
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
              fontFamily: "NunitoRegylar",
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
              fontFamily: "NunitoRegular",
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
              fontFamily: "NunitoRegular",
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
          <Text
            style={{
              color: "black",
              fontFamily: "Nunitobold",
              fontSize: 16,
            }}
          >
            OPSLAAN
          </Text>
        </TouchableOpacity>
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
