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
} from "react-native";
import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import NavBar from "@/components/NavigationBar";

type Notification = {
  id: string;
  title: string;
  description: string;
  icon_type: string;
  is_read: boolean;
  created_at: string;
  category: "is_eating" | "is_playing" | "is_running" | "is_toilet";
};

type Dog = {
  id: string;
  name: string;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dogName, setDogName] = useState<string>("je hond");
  const [dogId, setDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);

      // 1) Haal ingelogde gebruiker op
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert("Fout", "Kon gebruiker niet ophalen");
        setLoading(false);
        return;
      }

    
      const { data: dog, error: dogError } = await supabase
        .from("ar_dog")
        .select("id, name")
        .eq("user_id", user.id)
        .single();

      if (dogError || !dog) {
        Alert.alert("Fout", "Kon hond niet ophalen");
        setLoading(false);
        return;
      }

      setDogName(dog.name);
      setDogId(dog.id);

     
      const { data: rawNotifications, error: notifError } = await supabase
        .from("notifications")
        .select("id, title, description, icon_type, is_read, created_at, category")
        .eq("pet_id", dog.id)
        .order("created_at", { ascending: false });

      if (notifError || !rawNotifications) {
        Alert.alert(
          "Fout bij ophalen meldingen",
          notifError?.message || "Onbekende fout"
        );
        setLoading(false);
        return;
      }


      const personalized = rawNotifications.map((notif) => ({
        ...notif,
        title: notif.title.replace("{name}", dog.name),
        description: notif.description.replace("{name}", dog.name),
      }));

      setNotifications(personalized);
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
      console.error("Failed to update notification:", error.message);
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity
          style={{ position: "absolute", top: 98, left: 16 }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 70 }}>
          <Text style={{ fontFamily: "Sirenia", fontSize: 24, padding: 20 }}>
            Meldingen
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "600",
              fontSize: 20,
              marginBottom: 12,
            }}
          >
            Recente meldingen
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#97B8A5" />
          ) : (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={{
                  flexDirection: "row",
                  marginBottom: 24,
                  alignItems: "center",
                }}
                onPress={async () => {
                  // Als je wilt afvinken bij klik (ongelezen), haal de commentaar weg:
                  // await markAsRead(notif.id);

                  if (!dogId) {
                    Alert.alert(
                      "Fout",
                      "Kan hond niet vinden om te navigeren."
                    );
                    return;
                  }

                  router.push({
                    pathname: "/dogStart",
                    params: { petId: dogId, notificationId: notif.id },
                  });
                }}
              >
                {/* Bolletje voor ongelezen */}
                {!notif.is_read && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#F18B7E",
                      marginRight: 12,
                      alignSelf: "center",
                    }}
                  />
                )}

                {/* Hond‐afbeelding */}
                <Image
                  source={require("@/assets/images/cooper-profile.png")}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 15,
                    marginRight: 16,
                  }}
                />

                {/* Melding inhoud */}
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <FontAwesome
                      name="exclamation-triangle"
                      size={20}
                      color="#F18B7E"
                    />
                    <Text style={{ color: "#F18B7E", fontWeight: "600" }}>
                      {notif.title}
                    </Text>
                  </View>
                  <Text style={{ color: "#183A36", marginTop: 4 }}>
                    {notif.description}
                  </Text>
                  <Text
                    style={{
                      color: "#183A36",
                      opacity: 0.6,
                      fontSize: 12,
                      marginTop: 6,
                      fontFamily: "Nunito",
                    }}
                  >
                    {formatDate(notif.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}
