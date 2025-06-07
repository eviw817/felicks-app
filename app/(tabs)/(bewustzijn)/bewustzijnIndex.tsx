import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";

export default function BewustzijnScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const topics = [
    {
      title: "VOEDING",
      image: require("@/assets/images/voeding.png"),
      categorie: "voeding",
    },
    {
      title: "VEILIGHEID",
      image: require("@/assets/images/veiligheid.png"),
      categorie: "veiligheid",
    },
    {
      title: "TRAINING",
      image: require("@/assets/images/training.png"),
      categorie: "training",
    },
    {
      title: "VERZORGING",
      image: require("@/assets/images/verzorging.png"),
      categorie: "verzorging",
    },
    {
      title: "ACTIVITEIT",
      image: require("@/assets/images/activiteit.png"),
      categorie: "activiteit",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            gap: 25,
            paddingBottom: 120, // extra space for navbar
            backgroundColor: "#FFFDF9",
            paddingTop: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <BaseText
            style={{
              fontSize: 28,
              fontFamily: "SireniaMedium",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Bewustzijn
          </BaseText>
          <Text style={styles.subtitle}>Doe de quiz van de week</Text>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push("/quizIndex")}
          >
            <Text style={styles.quizButtonText}>QUIZ VAN DE WEEK</Text>
          </TouchableOpacity>

          <Text style={styles.learnMore}>Leer meer bij over:</Text>

          <View style={styles.buttonContainer}>
            {topics.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.infoButton}
                onPress={() =>
                  router.push({
                    pathname: "/artikelsIndex",
                    params: { categorie: item.categorie },
                  })
                }
              >
                <View style={styles.infoContent}>
                  <Image source={item.image} style={styles.infoImage} />
                  <Text style={styles.infoButtonText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
    gap: 25,
    color: "#183A36",
    paddingBottom: 80,
  },

  title: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "NunitoSemiBold",
    textAlign: "left",
  },

  quizButton: {
    backgroundColor: "#F18B7E",
    paddingVertical: 15,
    borderRadius: 20,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  quizButtonText: {
    fontFamily: "NunitoBold",
    fontSize: 14,
    color: "#FFFDF9",
  },

  learnMore: {
    marginBottom: -13,
    fontSize: 18,
    fontFamily: "NunitoSemiBold",
  },

  buttonContainer: {
    paddingVertical: 15,
    borderRadius: 20,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 2,
    marginTop: -10,
  },

  infoButton: {
    backgroundColor: "#FFD87E",
    paddingVertical: 15,
    borderRadius: 20,
    marginVertical: 5,
    width: "100%",
    paddingHorizontal: 10,
  },

  infoContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoImage: {
    width: 25,
    height: 25,
    marginRight: 16,
    marginLeft: 12,
  },

  infoButtonText: {
    fontFamily: "NunitoBold",
    fontSize: 14,
    color: "#183A36",
  },
});
