import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BaseText from "@/components/BaseText";

const STRAPI_BASE_URL = "https://landingspagina-felicks.onrender.com";

export default function Artikel() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [artikel, setArtikel] = useState<any | null>(null);

  useEffect(() => {
    if (!slug) return;
    const url =
      `${STRAPI_BASE_URL}/api/articles` +
      `?filters[slug][$eq]=${slug}` +
      `&populate=*`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setArtikel(d.data?.[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }
  if (!artikel) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Artikel niet gevonden.</Text>
      </View>
    );
  }

  const { title, summary, category, description } = artikel;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </Pressable>
        <BaseText style={styles.header}>{title}</BaseText>
        <View style={styles.backButton} />
      </View>

      <BaseText style={styles.badge}>{category?.name || "Onbekend"}</BaseText>
      <BaseText style={styles.summary}>{summary}</BaseText>

      {Array.isArray(description) ? (
        description.map((node: any, idx: number) => {
          // PARAGRAAF
          if (node.type === "paragraph") {
            return (
              <BaseText key={idx} style={styles.body}>
                {node.children?.map((child: any, cidx: number) => {
                  const { text = "", bold, italic, underline } = child;
                  return (
                    <Text
                      key={cidx}
                      style={[
                        bold && styles.bold,
                        italic && styles.italic,
                        underline && styles.underline,
                      ]}
                    >
                      {text}
                    </Text>
                  );
                })}
              </BaseText>
            );
          }

          // LIST
          if (node.type === "list") {
            const isOrdered = node.format === "ordered";
            return (
              <View key={idx} style={styles.listContainer}>
                {node.children?.map((liNode: any, lidx: number) => {
                  const itemText = (liNode.children || [])
                    .map((c: any) => c.text || "")
                    .join("");
                  const bullet = isOrdered ? `${lidx + 1}.` : "•";
                  return (
                    <BaseText key={lidx} style={styles.body}>
                      {bullet} {itemText}
                    </BaseText>
                  );
                })}
              </View>
            );
          }

          if (Array.isArray(node.children)) {
            const txt = node.children.map((c: any) => c.text || "").join("");
            return (
              <BaseText key={idx} style={styles.body}>
                {txt}
              </BaseText>
            );
          }

          return null;
        })
      ) : typeof description === "string" ? (
        <BaseText style={styles.body}>{description}</BaseText>
      ) : null}
    </ScrollView>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 36,
  },
  backButton: {
    width: 24,
    marginTop: 4,
    alignItems: "flex-start",
  },
  header: {
    flex: 1,
    fontSize: 24,
    fontFamily: "SireniaMedium",
    color: "#183A36",
    textAlign: "center",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#F18B7E",
    fontFamily: "NunitoBold",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,

    marginBottom: 16,
  },
  summary: {
    fontFamily: "NunitoMedium",
    fontSize: 16,
    color: "#183A36",
    marginBottom: 20,
    marginTop: 32,
    maxWidth: "95%",
  },
  body: {
    fontFamily: "NunitoRegular",
    fontSize: 16,
    color: "#183A36",
    marginTop: 24,
    lineHeight: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
  },
  error: {
    fontFamily: "NunitoRegular",
    color: "#183A36",
    fontSize: 16,
  },

  listContainer: {
    paddingLeft: 20,
    marginVertical: -10,
  },
  underline: {
    textDecorationLine: "underline",
  },
  bold: {
    fontFamily: "NunitoBold",
  },
  italic: {
    fontStyle: "italic",
  },
});
