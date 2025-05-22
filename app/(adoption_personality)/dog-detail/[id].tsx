"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function DogDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [dog, setDog] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("adoption_dogs")
        .select("*")
        .eq("id", id)
        .single();
      setDog(data);
    })();
  }, [id]);

  if (!dog) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>

        {/* Profielfoto hond */}
        {dog.images?.length > 0 && (
          <Image
            source={{ uri: dog.images[0] }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}

        {/* Naam en iconen */}
        <Text style={styles.name}>{dog.name}</Text>
        <View style={styles.iconRow}>
          <IconTag label={dog.size} icon="resize-outline" />
          <IconTag label={dog.activity_level} icon="walk-outline" />
          {dog.house_trained && (
            <IconTag label="Zindelijk" icon="home-outline" />
          )}
          {dog.social_with_dogs && (
            <IconTag label="Sociaal" icon="paw-outline" />
          )}
        </View>

        {/* Kerninfo */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Info</Text>
          <Text style={styles.detail}>Ras: {dog.breed}</Text>
          <Text style={styles.detail}>
            Geboortedatum: {new Date(dog.birthdate).toLocaleDateString("nl-BE")}
          </Text>
          <Text style={styles.detail}>Asiel: {dog.shelter}</Text>
        </View>

        {/* Beschrijving */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Beschrijving</Text>
          <Text style={styles.desc}>{dog.description}</Text>
        </View>

        {/* Eigenschappen */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Eigenschappen</Text>
          {renderAttribute(
            "Kindvriendelijk < 6 jaar",
            dog.child_friendly_under_6
          )}
          {renderAttribute(
            "Kindvriendelijk > 6 jaar",
            dog.child_friendly_over_6
          )}
          {renderAttribute("Zindelijk", dog.house_trained)}
          {renderAttribute("Sociaal met honden", dog.social_with_dogs)}
          {renderAttribute("Sociaal met katten", dog.social_with_cats)}
          {renderAttribute("Kan mee in de auto", dog.can_be_transported_in_car)}
          {renderAttribute("Hypoallergeen", dog.hypoallergenic)}
        </View>

        {/* Adopteerknop */}
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Contacteer het asiel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ Herbruikbaar mini-label met icoon
function IconTag({ label, icon }: { label: string; icon: any }) {
  return (
    <View style={styles.iconTag}>
      <Ionicons name={icon} size={18} color="#183A36" />
      <Text style={styles.iconTagText}>{label}</Text>
    </View>
  );
}

// ✅ Rij voor eigenschappen
function renderAttribute(label: string, value: boolean) {
  return (
    <View style={styles.attrRow}>
      <Text style={styles.attrLabel}>{label}</Text>
      <Ionicons
        name={value ? "checkmark-circle" : "close-circle"}
        size={20}
        color={value ? "#6AB04C" : "#D64545"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183A36",
    textAlign: "center",
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  iconTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5F4",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 4,
  },
  iconTagText: {
    marginLeft: 6,
    color: "#183A36",
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 6,
  },
  detail: {
    fontSize: 15,
    color: "#444",
    marginBottom: 2,
  },
  desc: {
    fontSize: 15,
    color: "#4A4A4A",
    lineHeight: 22,
  },
  attrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#DDD",
  },
  attrLabel: {
    fontSize: 15,
    color: "#183A36",
  },
  adoptButton: {
    marginTop: 20,
    backgroundColor: "#97B8A5",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  adoptButtonText: {
    fontSize: 16,
    color: "#FFFDF9",
    fontWeight: "bold",
  },
});
