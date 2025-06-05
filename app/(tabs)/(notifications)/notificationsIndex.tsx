// app/(tabs)/notifications/NotificationsScreen.tsx

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";


type Notification = {
  id: string;
  user_id: string | null;
  pet_id: string | null;
  title: string;
  description: string;
  icon_type: string;
  is_read: boolean;
  created_at: string;
  category:
  | "is_eating"
  | "is_playing"
  | "is_running"
  | "is_toilet"
  | "adoption_status";
  imageUrl?: string; // supabase image url
};


type ArDog = {
  id: string;
  name: string;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dogName, setDogName] = useState<string>("je hond");
  const [dogId, setDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const STORAGE_PUBLIC_BASE =
    "https://vgbuoxdfrbzqbqltcelz.supabase.co/storage/v1/object/public";

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Fout", "Kon ingelogde gebruiker niet ophalen");
        setLoading(false);
        return;
      }
      const { data: arDog, error: arDogError } = await supabase
        .from("ar_dog")
        .select("id, name")
        .eq("user_id", user.id)
        .single();

      if (arDogError || !arDog) {
        Alert.alert("Fout", "Kon AR-hond niet ophalen");
        setLoading(false);
        return;
      }
      setDogName(arDog.name);
      setDogId(arDog.id);


      const { data: rawNotifications, error: notifError } = await supabase
        .from("notifications")
        .select(
          "id, user_id, pet_id, title, description, icon_type, is_read, created_at, category"
        )
        .or(`user_id.eq.${user.id},pet_id.eq.${arDog.id}`)
        .order("created_at", { ascending: false });

      if (notifError || !rawNotifications) {
        Alert.alert(
          "Fout bij ophalen meldingen",
          notifError?.message || "Onbekende fout"
        );
        setLoading(false);
        return;
      }

      const enriched: Notification[] = await Promise.all(
        rawNotifications.map(async (notif) => {

          const title = notif.title.replace("{name}", arDog.name);
          const description = notif.description.replace("{name}", arDog.name);

          let posterImage: string | undefined = undefined;
          if (notif.category === "adoption_status") {
            const {
              data: rows,
              error: viewError,
            } = await supabase
              .from("requests_with_user_and_dog")
              .select("images")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1);

            if (!viewError && rows && rows.length > 0) {
              const arr = rows[0].images;
              if (Array.isArray(arr) && arr.length > 0) {
                const rawPath = arr[0];
                if (
                  rawPath.startsWith("http://") ||
                  rawPath.startsWith("https://")
                ) {
                  posterImage = rawPath;
                } else {
                  posterImage = `${STORAGE_PUBLIC_BASE}/${rawPath}`;
                }
              }
            }
          }


          return {
            ...notif,
            title,
            description,
            imageUrl: posterImage,
          };
        })
      );

      setNotifications(enriched);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Kon melding niet als gelezen markeren:", error.message);
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  };


  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hour}:${minute}`;
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Terug-knop */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
        </TouchableOpacity>

        {/* Titel “Meldingen” */}
        <View style={styles.titleContainer}>
          <BaseText style={styles.titleText}>Meldingen</BaseText>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.headerText}>Recente meldingen</Text>

          {notifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>
              Geen meldingen gevonden.
            </Text>
          ) : (
            notifications.map((notif) => {
              // Kies afbeeldingbron:
              // adoptie = image database
              // Anders → Cooper‐placeholder
              const uriSource = notif.imageUrl
                ? { uri: notif.imageUrl }
                : require("@/assets/images/cooper-profile.png");

              return (
                <TouchableOpacity
                  key={notif.id}
                  style={styles.notificationRow}
                  onPress={async () => {

                    if (notif.category === "adoption_status") {
                      if (!notif.is_read) {
                        await markAsRead(notif.id);
                      }
                      router.push("/profile");
                      return;
                    }

                    if (!dogId) {
                      Alert.alert(
                        "Fout",
                        "Kon AR-hond niet vinden om te navigeren."
                      );
                      return;
                    }
                    if (!notif.is_read) {
                      await markAsRead(notif.id);
                    }
                    router.push({
                      pathname: "/demo",
                      params: { petId: dogId, notificationId: notif.id },
                    });
                  }}
                >
                  {/* Ongelezen‐bolletje */}
                  {!notif.is_read && <View style={styles.unreadDot} />}

                  {/* Afbeelding */}
                  <Image
                    source={uriSource}
                    style={styles.notificationImage}
                  />

                  {/* Tekstgedeelte van de melding */}
                  <View style={styles.textContainer}>
                    <View style={styles.rowHeader}>
                      <FontAwesome
                        name={
                          notif.category === "adoption_status"
                            ? "info-circle"
                            : "exclamation-triangle"
                        }
                        size={20}
                        color="#F18B7E"
                      />
                      <Text style={styles.titleLabelText}>{notif.title}</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {notif.description}
                    </Text>
                    <Text style={styles.dateText}>
                      {formatDate(notif.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Fixed NavBar onderaan */}
      <View style={styles.navbarContainer}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 98,
    left: 16,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 70,
  },
  titleText: {
    fontFamily: "SireniaMedium",
    fontSize: 28,
    padding: 20,
    marginBottom: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  headerText: {
    fontFamily: "Nunito",
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 12,
  },
  noNotificationsText: {
    color: "#183A36",
    marginTop: 20,
    fontSize: 16,
  },
  notificationRow: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "center",
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F18B7E",
    marginRight: 12,
    alignSelf: "center",
  },
  notificationImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  titleLabelText: {
    color: "#F18B7E",
    fontWeight: "600",
  },
  descriptionText: {
    color: "#183A36",
    marginTop: 4,
    fontSize: 14,
  },
  dateText: {
    color: "#183A36",
    opacity: 0.6,
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Nunito",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
