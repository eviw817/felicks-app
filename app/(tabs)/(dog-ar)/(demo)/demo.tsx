import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { BeagleScene } from "@/components/augumented-dog/scenes/BeagleScene";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

type DogStatus = {
  id: string;
  user_id: string;
  breed: string;
  name: string;
  is_eating: boolean;
  is_playing: boolean;
  is_running: boolean;
  is_toilet: boolean;
};

type NotificationSummary = {
  id: string;
  summary: string;
  category: "is_eating" | "is_playing" | "is_running" | "is_toilet";
  is_read: boolean;
  created_at: string;
};

const AugmentedDog: React.FC = () => {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const router = useRouter();
  const navigation = useNavigation();
  const { petId, notificationId, fromArInfo } = useLocalSearchParams<{
    petId: string;
    notificationId?: string;
    fromArInfo?: string;
  }>();

  const cameFromArInfo = fromArInfo === "true";
  const [showOverlay, setShowOverlay] = useState(false);

  const [status, setStatus] = useState<DogStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationsList, setNotificationsList] = useState<
    NotificationSummary[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const defaultStatus: Pick<
    DogStatus,
    "is_eating" | "is_playing" | "is_running" | "is_toilet"
  > = {
    is_eating: false,
    is_playing: false,
    is_running: false,
    is_toilet: false,
  };

  const getStatusMessages = (dogName: string) => ({
    is_eating: {
      true: `${dogName} heeft flink hun eten opgegeten!`,
    },
    is_playing: {
      true: `${dogName} heeft kunnen spelen!`,
    },
    is_running: {
      true: `${dogName} vond het wandelen heel leuk!`,
    },
    is_toilet: {
      true: `${dogName} heeft hun behoefte kunnen doen!`,
    },
  });

  const fieldPriority: (keyof typeof defaultStatus)[] = [
    "is_eating",
    "is_playing",
    "is_running",
    "is_toilet",
  ];

  const markNotificationAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Kon melding niet als gelezen markeren:", error.message);
    }
  };

  useEffect(() => {
    if (!petId) {
      console.warn("petId ontbreekt!");
      setLoading(false);
      return;
    }

    if (cameFromArInfo) {
      console.log("User came from arInformation screen");
      setShowOverlay(true); // show the alert overlay
    }

    const fetchStatusEnNotifications = async () => {
      setLoading(true);

      const { data: dogData, error: statusError } = await supabase
        .from("ar_dog")
        .select("*")
        .eq("id", petId)
        .single();

      if (statusError || !dogData) {
        console.error(
          "Fout bij ophalen hondstatus:",
          statusError?.message || "geen data"
        );
        setLoading(false);
        return;
      }
      setStatus(dogData as DogStatus);
      const dogName = dogData.name || "je hond";

      const { data: notifData, error: notifError } = await supabase
        .from("notifications")
        .select("id, summary, category, is_read, created_at")
        .eq("pet_id", petId)
        .eq("is_read", false)
        .order("created_at", { ascending: true });

      if (notifError) {
        console.error("Fout bij ophalen meldingen:", notifError.message);
        setNotificationsList([]);
        setLoading(false);
        return;
      }

      if (notifData && notifData.length > 0) {
        const filledList: NotificationSummary[] = notifData.map((raw) => ({
          id: raw.id,
          summary: raw.summary.replace(/\{name\}/g, dogName),
          category: raw.category as NotificationSummary["category"],
          is_read: raw.is_read,
          created_at: raw.created_at,
        }));

        let startIndex = 0;
        if (notificationId) {
          const idx = filledList.findIndex((n) => n.id === notificationId);
          if (idx >= 0) {
            startIndex = idx;
          }
        }

        setNotificationsList(filledList);
        setCurrentIndex(startIndex);
      } else {
        setNotificationsList([]);
        setCurrentIndex(0);
      }

      setLoading(false);
    };

    fetchStatusEnNotifications();
  }, [petId, notificationId, cameFromArInfo]);

  const getCurrentMessages = (): string[] => {
    if (
      notificationsList.length > 0 &&
      currentIndex < notificationsList.length
    ) {
      return [notificationsList[currentIndex].summary];
    }

    if (status) {
      const dogName = status.name || "je hond";
      const statusMessagesMap = getStatusMessages(dogName);
      for (const field of fieldPriority) {
        if (status[field]) {
          return [statusMessagesMap[field].true];
        }
      }
    }

    return [];
  };

  const toggleStatus = async (field: keyof typeof defaultStatus) => {
    if (!status) return;
    const newValue = !status[field];
    setStatus((prev) => (prev ? { ...prev, [field]: newValue } : prev));

    const { error: updateError } = await supabase
      .from("ar_dog")
      .update({ [field]: newValue })
      .eq("id", status.id);

    if (updateError) {
      console.error("Kon hondstatus niet updaten:", updateError.message);
      setStatus((prev) => (prev ? { ...prev, [field]: !newValue } : prev));
      return;
    }

    if (newValue) {
      if (
        notificationsList.length > 0 &&
        currentIndex < notificationsList.length
      ) {
        const huidigeMelding = notificationsList[currentIndex];

        if (field === huidigeMelding.category) {
          await markNotificationAsRead(huidigeMelding.id);

          const volgende = currentIndex + 1;
          setCurrentIndex(volgende);
          if (volgende >= notificationsList.length) {
            setNotificationsList([]);
          }
        }
      }
    }
  };

  if (loading || !status) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ActivityIndicator size="large" color="#97B8A5" />
          <Text style={{ marginTop: 10 }}> Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const goToSettings = () => {
    router.push("/settings");
  };

  const messagesToShow = getCurrentMessages();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showOverlay && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
          onPress={() => setShowOverlay(false)} // close when tapped anywhere
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 12,
              maxWidth: "80%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontFamily: "NunitoRegular",
                color: "#183A36",
              }}
            >
              Scan de kamer zodat je vriend weet waar jij bent!
              {"\n\n"}Klik op het scherm om deze melding te sluiten.
            </Text>
          </View>
        </Pressable>
      )}

      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <BeagleScene />,
        }}
        style={{ flex: 1 }}
      >
        <BeagleScene style={{ width: "100%", height: 1000 }} />
      </ViroARSceneNavigator>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 68,
          left: 20,
          zIndex: 100,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* ─── Tekstballon ─── */}
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {messagesToShow.map((msg, idx) => (
          <Text
            key={idx}
            style={{
              margin: 6,
              backgroundColor: "#FDE4D2",
              borderRadius: 10,
              padding: 12,
              fontFamily: "NunitoRegular",
              fontSize: 16,
              color: "#183A36",
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        onPress={goToSettings}
        style={{
          position: "absolute",
          top: 68,
          right: 20,
          zIndex: 10,
        }}
      >
        <Ionicons name="settings-outline" size={32} color="#ffffff" />
      </TouchableOpacity>

      {/* ─── Buttons ─── */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 100,
          width: "100%",
        }}
      >
        {(
          [
            { field: "is_eating", icon: "bowl-food" },
            { field: "is_playing", icon: "baseball" },
            { field: "is_running", icon: "person-running" },
            { field: "is_toilet", icon: "poop" },
          ] as { field: keyof typeof defaultStatus; icon: any }[]
        ).map(({ field, icon }, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => toggleStatus(field)}
            style={{
              marginHorizontal: 10,
              borderRadius: 10,
              overflow: "hidden",
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: status[field]
                ? "rgba(255, 216, 126, 1)"
                : "rgba(253, 228, 210, 0.5)",
            }}
            accessibilityLabel={icon}
          >
            <FontAwesome6 name={icon} size={28} color="#183A36" />
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── NavBar ─── */}
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
};

export default AugmentedDog;
