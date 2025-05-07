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
                <Text style={styles.header}>{title}</Text>
               
                <View style={styles.backButton} />
            </View>


            <Text style={styles.badge}>{category?.name || "Onbekend"}</Text>

   
            <Text style={styles.summary}>{summary}</Text>
            <Text style={styles.body}>{descText}</Text>
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

        alignItems: "flex-start",
    },
    header: {
        fontSize: 20,
        fontFamily: "Nunito-Bold",
        color: "#183A36",
        textAlign: "center",
        maxWidth: 300,
        
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "#F18B7E",
        
        fontFamily: "Nunito-SemiBold",
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 16,
    },
    summary: {
        fontFamily: "Nunito-Regular",
        fontSize: 14,
        color: "#183A36",
        marginBottom: 20,
    },
    body: {
        fontFamily: "Nunito-Regular",
        fontSize: 14,
        color: "#183A36",
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
