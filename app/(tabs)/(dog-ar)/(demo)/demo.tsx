import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import NavBar from "@/components/NavigationBar";

// ────────────── (Originele AR-imports, nu uitgeschakeld) ──────────────
// import { BeagleScene } from "@/components/augumented-dog/scenes/BeagleScene";
// import { ViroARSceneNavigator } from "@reactvision/react-viro";


// ────────────── Types ──────────────

// Hondstatus‐type (ar_dog‐tabel)
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

// Meldingstype (notifications‐tabel)
type NotificationSummary = {
  id: string;
  summary: string; // {name} al vervangen
  category: "is_eating" | "is_playing" | "is_running" | "is_toilet";
  is_read: boolean;
  created_at: string;
};

const AugmentedDog: React.FC = () => {
  // (1) Haal petId én notificationId uit URL (expo-router)
  const { petId, notificationId } = useLocalSearchParams<{
    petId: string;
    notificationId?: string;
  }>();

  // (2) State: hondstatus + loader
  const [status, setStatus] = useState<DogStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // (3) State: ongelezen meldingen en index
  const [notificationsList, setNotificationsList] = useState<
    NotificationSummary[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // (4) Default‐waarden voor hondstatus‐velden
  const defaultStatus: Pick<
    DogStatus,
    "is_eating" | "is_playing" | "is_running" | "is_toilet"
  > = {
    is_eating: false,
    is_playing: false,
    is_running: false,
    is_toilet: false,
  };

  // (5) Helper: status‐berichten per veld (met hondnaam)
  const getStatusMessages = (dogName: string) => ({
    is_eating: {
      true: `${dogName} heeft flink zijn eten opgegeten!`,
    },
    is_playing: {
      true: `${dogName} heeft kunnen spelen!`,
    },
    is_running: {
      true: `${dogName} vond het wandelen heel leuk!`,
    },
    is_toilet: {
      true: `${dogName} heeft zijn behoefte kunnen doen!`,
    },
  });

  // (6) Prioriteit: volgorde voor status‐berichten als er geen melding is
  const fieldPriority: (keyof typeof defaultStatus)[] = [
    "is_eating",
    "is_playing",
    "is_running",
    "is_toilet",
  ];

  // Helper om melding in DB op gelezen te zetten
  const markNotificationAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("❌ Kon melding niet als gelezen markeren:", error.message);
    }
  };

  // ────────────── useEffect: hondstatus + alle ongelezen meldingen ophalen ──────────────
  useEffect(() => {
    if (!petId) {
      console.warn("❌ petId ontbreekt!");
      setLoading(false);
      return;
    }

    const fetchStatusEnNotifications = async () => {
      setLoading(true);

      // ── (A) Hondstatus ophalen ─────────────────────────────────
      const { data: dogData, error: statusError } = await supabase
        .from("ar_dog")
        .select("*")
        .eq("id", petId)
        .single();

      if (statusError || !dogData) {
        console.error(
          "❌ Fout bij ophalen hondstatus:",
          statusError?.message || "geen data"
        );
        setLoading(false);
        return;
      }
      setStatus(dogData as DogStatus);
      const dogName = dogData.name || "je hond";

      // ── (B) ALLE ongelezen meldingen ophalen, van oud → nieuw ──────
      const { data: notifData, error: notifError } = await supabase
        .from("notifications")
        // vraag nu category op, zodat we exact weten wat voor type melding het is
        .select("id, summary, category, is_read, created_at")
        .eq("pet_id", petId)
        .eq("is_read", false)
        .order("created_at", { ascending: true });

      if (notifError) {
        console.error("❌ Fout bij ophalen meldingen:", notifError.message);
        setNotificationsList([]);
        setLoading(false);
        return;
      }

      if (notifData && notifData.length > 0) {
        // (B1) Vervang {name} door hondnaam in de summary
        const filledList: NotificationSummary[] = notifData.map((raw) => ({
          id: raw.id,
          summary: raw.summary.replace(/\{name\}/g, dogName),
          category: raw.category as NotificationSummary["category"],
          is_read: raw.is_read,
          created_at: raw.created_at,
        }));

        // (B2) Als we vanuit NotificationsScreen met één specifieke notificationId gekomen zijn,
        // bepaal dan de juiste start‐index. Anders index = 0 (oudste)
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
  }, [petId, notificationId]);

  // ────────────── Bepaal welke tekstballon we tonen ──────────────
  const getCurrentMessages = (): string[] => {
    // 1) Staat er nog minstens één ongelezen melding? Toon precies die ene
    if (
      notificationsList.length > 0 &&
      currentIndex < notificationsList.length
    ) {
      return [notificationsList[currentIndex].summary];
    }

    // 2) Anders: toon hondstatus (in volgorde van fieldPriority)
    if (status) {
      const dogName = status.name || "je hond";
      const statusMessagesMap = getStatusMessages(dogName);
      for (const field of fieldPriority) {
        if (status[field]) {
          return [statusMessagesMap[field].true];
        }
      }
    }

    // 3) Anders: geen ballon
    return [];
  };

  // ────────────── Functie: togglet hondstatus én (alleen bij corrécte actie) melding lezen ──────────────
  const toggleStatus = async (field: keyof typeof defaultStatus) => {
    if (!status) return;

    // (1) Bereken de nieuwe waarde (false→true of true→false)
    const newValue = !status[field];

    // (2) Optimistisch UI‐update: zet de knop tijdelijk om
    setStatus((prev) => (prev ? { ...prev, [field]: newValue } : prev));

    // (3) Schrijf toggle naar Supabase
    const { error: updateError } = await supabase
      .from("ar_dog")
      .update({ [field]: newValue })
      .eq("id", status.id);

    if (updateError) {
      console.error("❌ Kon hondstatus niet updaten:", updateError.message);
      // Rollback in UI als het faalt
      setStatus((prev) => (prev ? { ...prev, [field]: !newValue } : prev));
      return;
    }

    // (4) Alleen als we van false → true gaan (newValue === true) én er is een melding in beeld,
    //     checken we of field === huidigeMelding.category om hem dan écht als gelezen te markeren.
    if (newValue) {
      if (
        notificationsList.length > 0 &&
        currentIndex < notificationsList.length
      ) {
        const huidigeMelding = notificationsList[currentIndex];

        if (field === huidigeMelding.category) {
          // (5) Markeer de melding als gelezen
          await markNotificationAsRead(huidigeMelding.id);

          // (6) Schuif door naar de volgende melding (of leeg de lijst als dit de laatste was)
          const volgende = currentIndex + 1;
          setCurrentIndex(volgende);
          if (volgende >= notificationsList.length) {
            setNotificationsList([]);
          }
        }
        // Als category mismatch, doen we niets; de melding blijft ongelezen.
      }
    }
    // (7) Bij true→false (newValue === false) gebeurt er niets: melding en UI blijven zoals ze waren.
  };

  // ────────────── Renderen ──────────────
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
          <Text style={{ marginTop: 10 }}>⏳ Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const messagesToShow = getCurrentMessages();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
      {/* ─── Originele AR‐component (uitgeschakeld in commentaar) ─── */}
      {/*
      <View style={{ flex: 1 }}>
        <BeagleScene petId={petId} />
      </View>
      */}
      {/*
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator
          initialScene={{ scene: BeagleScene }}
          style={{ flex: 1 }}
        />
      </View>
      */}
      {/* ────────────────────────────────────────────────────────────── */}

      {/* ─── Placeholder als indicatie dat AR uitstaat (ongeveer zoals je eerder had) ─── */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#183A36",
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          De AR‐weergave van je hond is tijdelijk uitgeschakeld tijdens
          development. Activeer dit later opnieuw om AR‐functies te testen.
        </Text>
      </View>
      {/* ────────────────────────────────────────────────────────────── */}

      {/* ─── Tekstballon (één melding óf hondstatus) ─── */}
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
              fontFamily: "Nunito",
              fontSize: 16,
              color: "#183A36",
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        ))}
      </View>

      {/* ─── Vier icon‐buttons voor hondstatus ─── */}
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

      {/* ─── NavBar onderaan ─── */}
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
