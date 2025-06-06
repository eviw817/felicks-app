import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import { useRouter, usePathname, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";

const tabs = [
  { name: "homepage", label: "Home", icon: "home" },
  { name: "adoptionChoice", label: "Adoptie", icon: "list" },
  { name: "dogStart", label: "Virtuele\nhond", icon: "paw" },
  { name: "bewustzijnIndex", label: "Bewustzijn", icon: "bulb" },
  { name: "profile", label: "Profiel", icon: "person" },
];

export default function NavBar() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
  });
  if (!fontsLoaded) return <View />;

  const router = useRouter();
  const pathname = usePathname();
  const { petId } = useLocalSearchParams();
  const [dogId, setDogId] = useState<string | null>(null);
  const [hasDogData, setHasDogData] = useState<boolean | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user?.id) {
          console.log("No valid session found", sessionError);
          setDogId(null);
          return;
        }

        const { data, error } = await supabase
          .from("ar_dog")
          .select("id, breed, name")
          .eq("user_id", session.user.id)
          .single();

        if (error || !data?.breed || !data?.name) {
          setHasDogData(false);
        } else {
          setHasDogData(true);
          setDogId(data.id);
        }
      } catch (err) {
        console.error("Error in fetchDogData:", err);
        setHasDogData(false);
      }
    };

    fetchDogData();
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handlePress = (name: string) => {
    if (name === "dogStart") {
      if (hasDogData === true) {
        router.push({
          pathname: "/demo",
          params: { petId: dogId },
        });
      } else {
        router.push("/dogStart");
      }
    } else {
      try {
        router.push(("/" + name) as any);
      } catch (err) {
        console.error("Invalid route:", name, err);
      }
    }
  };

  if (keyboardVisible) return null;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handlePress(tab.name)}
          >
            <Ionicons
              name={isActive ? tab.icon : (`${tab.icon}-outline` as any)}
              size={32}
              color={isActive ? "#FDE4D2" : "#FFFDF9"}
            />
            <Text
              style={{
                color: isActive ? "#FDE4D2" : "#FFFDF9",
                textAlign: "center",
                fontSize: 14,
                fontFamily: "NunitoRegular",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 3,
    borderTopColor: "#FDE4D2",
    backgroundColor: "#2F4D4A",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  tab: {
    alignItems: "center",
  },
});
