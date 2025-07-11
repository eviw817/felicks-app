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
import BaseText from "@/components/BaseText";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

function IconTag({ label, icon }: { label: string; icon: any }) {
  return (
    <View style={styles.iconTag}>
      <Ionicons name={icon} size={18} color="#183A36" />
      <BaseText style={styles.iconTagText}>{label}</BaseText>
    </View>
  );
}

function renderAttribute(label: string, value: boolean) {
  return (
    <View style={styles.attrRow}>
      <BaseText style={styles.attrLabel}>{label}</BaseText>
      <Ionicons
        name={value ? "checkmark-circle" : "close-circle"}
        size={20}
        color={value ? "#6AB04C" : "#D64545"}
      />
    </View>
  );
}

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

  let imageList: string[] = [];
  try {
    imageList =
      typeof dog.images === "string" ? JSON.parse(dog.images) : dog.images;
  } catch (e) {
    console.error("❌ Fout bij parsen van images:", e);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
           <View style={styles.header}>
                         <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={30} color="#183A36" />
          </TouchableOpacity>
          <BaseText variant="title" style={styles.title}>
            {dog.name}
          </BaseText>
        </View>

        {imageList?.length > 0 && imageList[0] ? (
          <Image
            source={{ uri: imageList[0] }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("@/assets/images/logo_felicks.png")}
            style={styles.avatar}
            resizeMode="contain"
          />
        )}

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

        <View style={styles.section}>
          <BaseText style={styles.subtitle}>Info</BaseText>
          <BaseText style={styles.detail}>Ras: {dog.breed}</BaseText>
          <BaseText style={styles.detail}>
            Geboortedatum: {new Date(dog.birthdate).toLocaleDateString("nl-BE")}
          </BaseText>
          <BaseText style={styles.detail}>Asiel: {dog.shelter}</BaseText>
        </View>

        <View style={styles.section}>
          <BaseText style={styles.subtitle}>Beschrijving</BaseText>
          <BaseText style={styles.desc}>{dog.description}</BaseText>
        </View>

        <View style={styles.section}>
          <BaseText style={styles.subtitle}>Eigenschappen</BaseText>
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

        {imageList?.length > 0 && (
          <View style={styles.gallerySection}>
            <BaseText style={styles.subtitle}>Foto's</BaseText>
            {imageList.map((path, index) =>
              path ? (
                <Image
                  key={index}
                  source={{ uri: path }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  key={index}
                  source={require("@/assets/images/logo_felicks.png")}
                  style={styles.galleryImage}
                  resizeMode="contain"
                />
              )
            )}
          </View>
        )}
        <TouchableOpacity style={styles.adoptButton} onPress={() => router.push("/profile")}>
          <BaseText variant="button">Contacteer het asiel</BaseText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    padding: 16,
    paddingTop: 50,
    paddingBottom: 50,
  },
  header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        width: "100%",
        position: "relative", 
        paddingVertical: 10,
      },
  back: {
     position: "absolute",
      left: 5,
      top:10,
  },
  title: {
        fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 20,
        marginLeft: 20,
    },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 12,
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
    backgroundColor: "#FDE4D2",
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
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adoptButtonText: {
     color: "#183A36",
    fontSize: 16,
    fontFamily: "NunitoBold",
  },
  gallerySection: {
    marginTop: 12,
    gap: 12,
  },
  galleryImage: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: 10,
    marginBottom: 10,
  },
});
