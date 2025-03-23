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
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";

export default function DogNotifications() {
  const router = useRouter();

  // For Sound toggle
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const soundAnim = useRef(new Animated.Value(1)).current;
  const toggleSoundSwitch = () => {
    Animated.sequence([
      Animated.timing(soundAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(soundAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    setIsSoundEnabled((previousState) => !previousState);
  };

  // For Camera toggle
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const cameraAnim = useRef(new Animated.Value(1)).current;
  const toggleCameraSwitch = () => {
    Animated.sequence([
      Animated.timing(cameraAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(cameraAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    setIsCameraEnabled((previousState) => !previousState);
  };

  // For Notification toggle
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const notificationAnim = useRef(new Animated.Value(1)).current;
  const toggleNotificationSwitch = () => {
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    setIsNotificationEnabled((previousState) => !previousState);
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
          Tijd om voor Cooper te zorgen!
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            padding: 20,
          }}
        >
          Geef toestemming voor het gebruik van je camera, geluid en meldingen,
          zodat we je optimaal kunnen ondersteunen bij de zorg voor Cooper.
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
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
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 36,
              paddingRight: 8,
            }}
          >
            •
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingRight: 8,
            }}
          >
            Je camera gebruiken om je te helpen bij het maken van foto's van
            Cooper.
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
            }}
          >
            •
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingRight: 12,
            }}
          >
            Geluid inschakelen voor interactie en meldingen.
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
            }}
          >
            •
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingRight: 8,
            }}
          >
            Je waarschuwen wanneer Cooper honger heeft, wil spelen, wandelen of
            naar het toilet moet.
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            padding: 20,
            paddingTop: 12,
          }}
        >
          Klaar om Cooper de beste zorg te geven? Zet de schuifjes aan en druk
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingVertical: 8,
            }}
          >
            Geluid
          </Text>
          <Switch
            style={{
              marginRight: 20,
            }}
            trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
            thumbColor={isSoundEnabled ? "#ececeb" : "#ececeb"}
            onValueChange={toggleSoundSwitch}
            value={isSoundEnabled}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingVertical: 8,
            }}
          >
            Camera
          </Text>
          <Switch
            style={{
              marginRight: 20,
            }}
            trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
            thumbColor={isCameraEnabled ? "#ececeb" : "#ececeb"}
            onValueChange={toggleCameraSwitch}
            value={isCameraEnabled}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              padding: 20,
              paddingVertical: 8,
            }}
          >
            Meldingen
          </Text>
          <Switch
            style={{
              marginRight: 20,
            }}
            trackColor={{ false: "#cac5c5", true: "#97b8a5" }}
            thumbColor={isNotificationEnabled ? "#ececeb" : "#ececeb"}
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
          />
        </View>
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
          href="/dogFeaturesInfo"
        >
          OPSLAAN
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
