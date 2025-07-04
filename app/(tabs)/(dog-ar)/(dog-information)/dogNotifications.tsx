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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
          setFetchError(error.message);
        } else {
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
        // 👇 Check if any toggle is disabled
        const anyDisabled =
          !isNotificationEnabled || !isSoundEnabled || !isCameraEnabled;

        if (anyDisabled) {
          router.push(`/dogPermissionsCheck?petId=${petId}`);
        } else {
          router.push(`/dogFeaturesInfo?petId=${petId}`);
        }
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
          onPress={() => router.push(`/dogInformation?petId=${petId}`)}
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
          
            padding: 20,
     color: "#183A36",
              fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 20,
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
            color: "#183A36",
          }}
        >
          Geef toestemming voor camera, geluid en meldingen.
        </Text>
        <Text
          style={{
             fontFamily: "NunitoRegular",
              fontSize: 16,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 40,
            color: "#183A36",
          }}
        >
          Zo kunnen we jou helpen goed voor {dogName || "nog geen naam"} te
          zorgen!
        </Text>
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
              color: "#183A36",
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
              color: "#183A36",
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
              color: "#183A36",
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
              color: "#183A36",
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
              color: "#183A36",
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
              color: "#183A36",
            }}
          >
            Je waarschuwen als {dogName || "nog geen naam"} honger heeft, wil
            spelen of naar buiten moet
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
          Zet de schuifjes aan en druk op 'Opslaan' om verder te gaan!
        </Text>
        <Text
          style={{
            fontFamily: "NunitoBold",
              fontSize: 18,
            padding: 20,
            paddingBottom: 8,
            color: "#183A36",
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
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 8,
              marginTop: 8,
              flexShrink: 1,
              color: "#183A36",
            }}
          >
            Geluid
          </Text>
          <Animated.View style={{ transform: [{ scale: soundAnim }] }}>
            <Switch
              trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
              thumbColor={isSoundEnabled ? "#ececeb" : "#ececeb"}
              ios_backgroundColor="#ececeb"
              onValueChange={toggleSoundSwitch}
              value={isSoundEnabled}
            />
          </Animated.View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 8,
              marginTop: 8,
              flexShrink: 1,
              color: "#183A36",
            }}
          >
            Camera
          </Text>
          <Animated.View style={{ transform: [{ scale: cameraAnim }] }}>
            <Switch
              trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
              thumbColor={isCameraEnabled ? "#ececeb" : "#ececeb"}
              ios_backgroundColor="#ececeb"
              onValueChange={toggleCameraSwitch}
              value={isCameraEnabled}
            />
          </Animated.View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 8,
              marginTop: 8,
              flexShrink: 1,
              color: "#183A36",
            }}
          >
            Meldingen
          </Text>
          <Animated.View style={{ transform: [{ scale: notificationAnim }] }}>
            <Switch
              trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
              thumbColor={isNotificationEnabled ? "#ececeb" : "#ececeb"}
              ios_backgroundColor="#ececeb"
              onValueChange={toggleNotificationSwitch}
              value={isNotificationEnabled}
            />
          </Animated.View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: "#97B8A5",
            marginVertical: 20,
            marginHorizontal: 20,
            borderRadius: 15,
            paddingVertical: 15,
            paddingHorizontal: 40,
            alignItems: "center",
          }}
          disabled={loading}
        >
          <Text
            style={{
              backgroundColor: "#97B8A5",
              fontFamily: "NunitoBold",
              textAlign: "center",
            }}
          >
            {loading ? "Bezig met opslaan..." : "OPSLAAN"}
          </Text>
        </TouchableOpacity>

        {fetchError ? (
          <Text
            style={{
                 fontFamily: "NunitoBold",
                fontSize: 16,
              padding: 20,
              color: "red",
              textAlign: "center",
            }}
          >
            {fetchError}
          </Text>
        ) : null}
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
