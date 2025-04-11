import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login-register/startpage/startpage");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container} className="bg-baby-powder">
      <Image
        source={require("../assets/images/logo_felicks.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 340,
    height: 340,
    resizeMode: "contain",
  },
});
