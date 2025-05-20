import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const tabs = [
  { name: "homepage", label: "Home", icon: "home" },
  {
    name: "(adoption_personality)/personality_traits",
    label: "Adoptie",
    icon: "list",
  },
  { name: "virtuele-hond", label: "Virtuele\nhond", icon: "paw" },
  { name: "bewustzijn", label: "Bewustzijn", icon: "bulb" },
  { name: "profiel", label: "Profiel", icon: "person" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(("/" + tab.name) as any)}
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
                fontFamily: "Nunito",
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
