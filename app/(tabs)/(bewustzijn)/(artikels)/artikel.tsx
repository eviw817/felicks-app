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
import NavBar from "@/components/NavigationBar";

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
            .catch(() => {
                setLoading(false);
            });
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

  
    let descText = "Geen beschrijving beschikbaar.";
    if (Array.isArray(description)) {
        descText = description
            .map((node: any) =>
                Array.isArray(node.children)
                    ? node.children.map((c: any) => c.text).join("")
                    : node.text || ""
            )
            .join("\n\n");
    } else if (typeof description === "string") {
        descText = description;
    }

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
            <BaseText style={styles.body}>{descText}</BaseText>
            {/* nav */}
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
        marginTop: 75,
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
        fontFamily: "Sirenia-Medium",
        color: "#183A36",
        textAlign: "center",
      },
      badge: {
        alignSelf: "flex-start",
        backgroundColor: "#F18B7E",
        fontFamily: "Nunito-SemiBold",
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 36,
        
      },
      summary: {
        fontFamily: "Nunito-MediumItalic",
        fontSize: 14,
        color: "#183A36",
        marginBottom: 20,
        maxWidth: "95%",
      },
      body: {
        fontFamily: "Nunito-Regular",
        fontSize: 14,
        color: "#183A36",
        marginTop: 24,
        lineHeight: 20,
      },
      center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFDF9",
      },
      error: {
        fontFamily: "Nunito-Regular",
        color: "#183A36",
        fontSize: 16,
      },
});
