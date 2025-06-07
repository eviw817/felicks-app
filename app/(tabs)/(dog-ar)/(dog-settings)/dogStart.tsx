import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { useFonts } from "expo-font";
import BaseText from "@/components/BaseText";

export default function DogStart() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
    SireniaSemiBold: require("@/assets/fonts/Sirenia/SireniaSemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BaseText style={styles.title}>Welkom bij de virtuele hond</BaseText>

        <Text style={styles.subtitle}>
          Altijd al gedroomd van een trouwe viervoeter in huis?
        </Text>
        <Text style={styles.description}>
          Maar ben jij er klaar voor? {"\n"}
          Dan is deze ervaring precies wat je nodig hebt om daar achter te
          komen!
        </Text>

        <View style={styles.stepContainer}>
          <Image
            style={styles.stepImage}
            source={require("@/assets/images/step1.png")}
          />
          <View>
            <Text style={styles.stepTitle}>Step 1</Text>
            <Text style={styles.stepText}>Maak jouw virtuele hond aan.</Text>
          </View>
        </View>

        <View style={styles.stepContainerRight}>
          <Image
            style={[styles.stepImage, styles.stepImageRight]}
            source={require("@/assets/images/step2.png")}
          />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Step 2</Text>
            <Text style={styles.stepText}>
              Ga op avontuur met jouw viervoeter en ontdek het zelf!
            </Text>
          </View>
        </View>

        <Text style={styles.noticeTitle}>Niet te vergeten!</Text>
        <Text style={styles.noticeText}>
          Het is leerzaam, leuk én helemaal gratis!
        </Text>

        <Link style={styles.ctaButton} href="/dogBreed">
          BEGIN NU
        </Link>
      </ScrollView>

      <View style={styles.navbarWrapper}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    paddingTop: 20,
  },
  scrollContent: {
    top: 1,
    marginTop: 40,
    justifyContent: "flex-start",
    paddingRight: 140,
  },
  title: {
    fontSize: 28,
    fontFamily: "SireniaMedium",
    textAlign: "center",
    padding: 20,
  },
  subtitle: {
    fontFamily: "NunitoBold",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#183A36",
    marginBottom: 10,
  },
  description: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#183A36",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  stepContainerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#97B8A5",
  },
  stepImageRight: {
    marginLeft: 20,
  },
  stepTextContainer: {
    marginRight: 20,
  },
  stepTitle: {
    fontFamily: "NunitoBold",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#183A36",
  },
  stepText: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    paddingHorizontal: 20,
    marginRight: 100,
    color: "#183A36",
  },
  noticeTitle: {
    fontFamily: "Nunito",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#183A36",
    marginTop: 20,
  },
  noticeText: {
    fontFamily: "NunitoRegular",
    fontWeight: "400",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#183A36",
  },
  ctaButton: {
    padding: 12,
    margin: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#97B8A5",
    fontFamily: "NunitoBold",
    fontSize: 15,
    borderRadius: 15,
    textAlign: "center",
    color: "#183A36",
    width: "90%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
