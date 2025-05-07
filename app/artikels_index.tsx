import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const STRAPI_BASE_URL = "https://landingspagina-felicks.onrender.com";

export default function ArtikelsIndex() {
  const { categorie } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [artikels, setArtikels] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (categorie) {
      const url = `${STRAPI_BASE_URL}/api/articles?populate[category]=*&filters[category][slug][$eq]=${categorie}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setArtikels(data.data || []);
        })
        .catch((err) => console.error("Fout bij ophalen uit Strapi:", err));
    }
  }, [categorie]);

  const gefilterdeArtikels = artikels.filter((artikel) => {
    const a = artikel.attributes ?? artikel;
    const zoek = searchTerm.toLowerCase();
    return (
      a.title?.toLowerCase().includes(zoek) ||
      a.summary?.toLowerCase().includes(zoek)
    );
  });

  return (
    <View style={styles.container}>
      {/* Bovenste balk met pijl en titel */}
      <View style={styles.topbar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </Pressable>
        <Text style={styles.header}>{categorie}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Zoekbalk */}
      <TextInput
        style={styles.search}
        placeholder="Zoek onderwerpen"
        placeholderTextColor="#A0A0A0"
        keyboardType="default" // systeem bepaalt azerty/qwerty
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      <ScrollView>
        {gefilterdeArtikels.length === 0 ? (
          <Text style={styles.noResults}>Geen artikels gevonden voor deze categorie.</Text>
        ) : (
          gefilterdeArtikels.map((artikel) => {
            const a = artikel.attributes ?? artikel;
            if (!a.title || !a.summary) return null;

            const title = a.title;
            const summary = a.summary;
            const categoryName = a.category?.name || "Onbekend";

            return (
                <Pressable
                key={artikel.id}
                style={styles.card}
                onPress={() => router.push(`/artikel?slug=${a.slug}`)}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.badge}>{categoryName}</Text>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.summary}>{summary}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 75,
    marginBottom: 36,
  },
  backButton: {
    width: 24,
    alignItems: "flex-start",
  },
  header: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    color: "#183A36",
    textAlign: "center",
  },
  search: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 24,
    fontFamily: "Nunito-Regular",
    borderColor: "#ccc",
    borderWidth: 1,
    color: "#183A36",
  },
  noResults: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Nunito-Regular",
    color: "#183A36",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "rgba(253, 228, 210, 0.65)",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  badge: {
    backgroundColor: "#F18B7E", 
    fontFamily: "Nunito-SemiBold",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
 
  },
  title: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#183A36",
  },
  summary: {
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#183A36",
  },
});
