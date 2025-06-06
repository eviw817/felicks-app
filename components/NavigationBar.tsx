import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  if (!fontsLoaded) {
    return <View />;
  }

  const router = useRouter();
  const pathname = usePathname();
  const { petId } = useLocalSearchParams();
  const [dogId, setDogId] = useState<string | null>(null);
  const [hasDogData, setHasDogData] = useState<boolean | null>(null);

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
          setDogId(data.id); // <--- store it in state
        }
      } catch (err) {
        console.error("Error in fetchDogData:", err);
        setHasDogData(false);
      }
    };

    fetchDogData();
  }, []);

  const handlePress = (name: string) => {
    if (name === "dogStart") {
      if (hasDogData === true) {
        router.push({
          pathname: "/demo", // or whatever page you're going to
          params: { petId: dogId }, // pass petId here!
        });
      } else {
        router.push("/dogStart");
      }
    } else {
      // Optional: double-check route exists before pushing
      try {
        router.push(("/" + name) as any);
      } catch (err) {
        console.error("Invalid route:", name, err);
      }
    }
  };

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
  },
  tab: {
    alignItems: "center",
  },
});
