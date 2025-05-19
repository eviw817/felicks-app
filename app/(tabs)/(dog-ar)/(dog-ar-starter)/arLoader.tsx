import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/arStart");
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
    }}>
      <LottieView
        source={require("../../../../assets/animations/loader.json")}
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
        Cooper wordt op jouw profiel ontworpen
      </Text>
    </SafeAreaView>
  );
}

