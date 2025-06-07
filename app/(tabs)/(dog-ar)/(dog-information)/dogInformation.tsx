import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useFonts } from "expo-font";

export default function DogInformation() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const router = useRouter();
  const navigation = useNavigation();
  const { petId } = useLocalSearchParams();

  const [dogName, setDogName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  if (!fontsLoaded) return <View />;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.content}>
          {loading && <Text style={styles.loadingText}>Laden...</Text>}
  {fetchError ? (
    <Text style={styles.errorText}>
      Fout bij laden naam: {fetchError}
    </Text>
  ) : (
    !loading && (
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.push(`/dogName?petId=${petId}`)}
          style={styles.backButtonInline}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Tijd om voor {dogName || "nog geen naam"} te zorgen!
        </Text>
      </View>
    )
  )}

          <Text style={styles.description}>
            {dogName || "nog geen naam"} staat te trappelen om jouw nieuwe
            virtuele beste vriend te worden!
          </Text>

          <Text style={styles.subtitle}>
            Klaar om samen op avontuur te gaan?
          </Text>

          <Text style={styles.description}>
            Met de camera van je telefoon komt {dogName || "nog geen naam"} tot
            leven in AR (Augmented Reality).
          </Text>

          <Text style={styles.description}>
            Neem {dogName || "nog geen naam"} overal mee naartoe en speel met{" "}
            {dogName || "nog geen naam"} alsof die echt bij je is.
          </Text>

          <Text style={styles.subtitle}>Hoe leuk is dat?</Text>

          <Text style={styles.description}>
            <Text style={styles.bold}>Maar</Text> {dogName || "nog geen naam"}{" "}
            is meer dan alleen een schattige hond. Honden kunnen niet zomaar op
            "pauze" worden gezet.
          </Text>

          <Text style={styles.description}>
            {dogName || "nog geen naam"} laat je zien wat er echt bij een
            huisdier komt kijken:
          </Text>

          <View style={styles.chipRow}>
            <Text style={styles.chip}>Liefde</Text>
            <Text style={styles.chip}>Tijd</Text>
            <Text style={styles.chip}>Aandacht</Text>
          </View>

          <Text style={styles.description}>
            Spelen is pas het begin… er valt nog zoveel meer te ontdekken!
          </Text>

          <Link
            style={styles.ctaButton}
            href={`/dogNotifications?petId=${petId}`}
          >
            DOORGAAN
          </Link>
        </View>
      </ScrollView>

      <View style={styles.navbarContainer}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    paddingBottom: 140,
    color: "#183A36",
  },
  scrollContent: {
    justifyContent: "flex-start",
  },
  headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  paddingHorizontal: 20,
},

backButtonInline: {
  marginRight: 10,
},

  backButton: {
    position: "absolute",
    top: 68,
    left: 40,
  },
  content: {
    marginTop: 40,
    flex: 1,
    justifyContent: "flex-start",
  },
  loadingText: {
    padding: 20,
  },
  errorText: {
    padding: 20,
    color: "red",
  },
  title: {
   fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 20,
        color: "#183A36",
        marginTop: 20,
  },
  description: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    padding: 20,
    paddingBottom: 0,
    color: "#183A36",
  },
  subtitle: {
    fontFamily: "NunitoBold",
    fontSize: 16,
    paddingBottom: 8,
    paddingLeft: 20,
    color: "#183A36",
  },
  bold: {
    fontFamily: "NunitoBold",
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    marginBottom: 0,
  },
  chip: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    padding: 20,
    paddingVertical: 10,
    backgroundColor: "#FFD87E",
    borderRadius: 10,
  },
  ctaButton: {
    padding: 12,
    margin: 20,
    paddingHorizontal: 20,
    backgroundColor: "#97B8A5",
    fontFamily: "NunitoBold",
    fontSize: 16,
    borderRadius: 15,
    textAlign: "center",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
