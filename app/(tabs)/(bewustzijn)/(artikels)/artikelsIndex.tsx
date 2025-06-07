// app/artikels_index.tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";
import NavBar from "@/components/NavigationBar";

const STRAPI_BASE_URL = "https://landingspagina-felicks.onrender.com";

export default function ArtikelsIndex() {
  const { categorie } = useLocalSearchParams<{ categorie: string }>();
  const navigation = useNavigation();
  const router = useRouter();

  const [artikels, setArtikels] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorie) return;

    const url =
      `${STRAPI_BASE_URL}/api/articles` +
      `?filters[category][slug][$eq]=${encodeURIComponent(categorie)}` +
      `&populate=*`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setArtikels(json.data || []);
      })
      .catch((err) => console.error("Fout bij ophalen uit Strapi:", err))
      .finally(() => setLoading(false));
  }, [categorie]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#97B8A5" />
      </View>
    );
  }

  const filtered = artikels.filter((item) => {
    const title = item.title || "";
    const summary = item.summary || "";
    const q = searchTerm.toLowerCase();
    return title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </Pressable>
        <BaseText style={styles.header}>{categorie}</BaseText>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Zoek onderwerpen"
        placeholderTextColor="#A0A0A0"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Articles */}
      <ScrollView>
        {filtered.length === 0 ? (
          <BaseText style={styles.noResults}>
            Geen artikels gevonden voor deze categorie.
          </BaseText>
        ) : (
          filtered.map((article) => {
            const { id, title, summary, slug, category, image } = article;
            const categoryName = category?.name || "Onbekend";

            // Image logic
            let imageUri: string | undefined;
            if (Array.isArray(image) && image.length > 0) {
              const img = image[0];
              const thumb = img.formats?.thumbnail?.url;
              const path = thumb || img.url;
              imageUri = STRAPI_BASE_URL + path;
            }

            return (
              <Pressable
                key={id}
                style={styles.card}
                onPress={() => router.push(`../artikel?slug=${slug}`)}
              >
                {imageUri && (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                )}
                <BaseText style={styles.badgeOverlay}>{categoryName}</BaseText>
                <View style={styles.cardContent}>
                  <BaseText style={styles.title}>{title}</BaseText>
                  <BaseText style={styles.summary}>{summary}</BaseText>
                </View>
              </Pressable>
            );
          })
        )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 36,
  },
  backButton: {
    width: 24,
    alignItems: "flex-start",
  },
  header: {
    flex: 1,
    fontSize: 24,
    fontFamily: "SireniaMedium",
    color: "#183A36",
    textAlign: "center",
    textTransform: "capitalize",
  },
  search: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    fontFamily: "NunitoRegular",
    borderColor: "#ccc",
    borderWidth: 1,
    color: "#183A36",
  },
  noResults: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "NunitoRegular",
    color: "#183A36",
  },
  card: {
    position: "relative", // nodig om categorie erboven te krijgen
    backgroundColor: "rgba(253, 228, 210, 0.65)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  badgeOverlay: {
    position: "absolute",
    top: 32,
    right: 32,
    backgroundColor: "#F18B7E",
    color: "#183A36",
    fontFamily: "NunitoBold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    zIndex: 10,
  },

  cardImage: {
    width: "90%",
    height: 180,
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 16,
  },
  cardContent: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontFamily: "SireniaSemiBold",
    marginTop: 4,
    marginBottom: 4,
    color: "#183A36",
  },
  summary: {
    fontSize: 16,
    fontFamily: "NunitoRegular",
    color: "#183A36",
  },
});
