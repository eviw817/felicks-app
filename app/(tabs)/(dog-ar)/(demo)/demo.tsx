import { BeagleScene } from "@/components/augumented-dog/scenes/BeagleScene";
// import { ViroARSceneNavigator } from "@reactvision/react-viro"; // TIJDELIJK UIT
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import NavBar from "@/components/NavigationBar";

// ✅ Het type voor de AR‐hondstatus
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

// ✅ Het type voor de (één enkele) notification‐samenvatting die we nodig hebben
type NotificationSummary = {
  id: string;
  summary: string;
  is_read: boolean;
  created_at: string;
};

const AugumentedDog = () => {
  const { petId } = useLocalSearchParams();

  // HUIDIGE STATE VAN DE HOND (ar_dog‐row)
  const [status, setStatus] = useState<DogStatus | null>(null);

  // LOADER
  const [loading, setLoading] = useState(true);

  // **Nieuw**: state om één ongelezen notificationSummary in op te slaan
  const [notificationSummary, setNotificationSummary] = useState<string | null>(null);

  // Default‐waarden voor de vier boolean‐velden
  const defaultStatus: Pick<
    DogStatus,
    "is_eating" | "is_playing" | "is_running" | "is_toilet"
  > = {
    is_eating: false,
    is_playing: false,
    is_running: false,
    is_toilet: false,
  };

  // Houd bij welk veld als laatste is getoggled (eet/spelen/lopen/toilet)
  const [lastToggledField, setLastToggledField] = useState<
    null | keyof typeof defaultStatus
  >(null);

  // ** useEffect: haal ófwel hondstatus ófwel notificationSummary op **
  useEffect(() => {
    if (!petId || typeof petId !== "string") {
      console.warn("❌ petId is missing of invalid");
      return;
    }

    const fetchStatusAndNotification = async () => {
      setLoading(true);

      // 1) EERST: haal álle velden van ar_dog op
      const { data: dogData, error: statusError } = await supabase
        .from("ar_dog")
        .select("*")
        .eq("id", petId)
        .single();

      if (statusError) {
        console.error("❌ Error fetching dog status:", statusError.message);
        setLoading(false);
        return;
      }
      if (!dogData) {
        console.warn("⚠️ Geen hond gevonden voor petId:", petId);
        setLoading(false);
        return;
      }

      setStatus(dogData as DogStatus);

      // Bepaal hondnaam voor placeholder‐vervanging
      const dogName = dogData.name || "je hond";

      // 2) DAN: haal de meest recente ongelezen melding op (één record)
      const { data: notifData, error: notifError } = await supabase
        .from("notifications")
        .select("id, summary, is_read, created_at")
        .eq("pet_id", petId)
        .eq("is_read", false)         // enkel ongelezen meldingen
        .order("created_at", { ascending: false })
        .limit(1);

      if (notifError) {
        console.error("❌ Error fetching notifications:", notifError.message);
        // Mocht er iets misgaan, verwijderen we eventuele oude summary
        setNotificationSummary(null);
        setLoading(false);
        return;
      }

      // Als er een ongelezen melding is, vul de summary (met {name}→hondnaam)
      if (notifData && notifData.length > 0) {
        const latestNotif: NotificationSummary = notifData[0] as NotificationSummary;
        const filledSummary = latestNotif.summary.replace(/\{name\}/g, dogName);
        setNotificationSummary(filledSummary);
      } else {
        // Geen ongelezen melding
        setNotificationSummary(null);
      }

      setLoading(false);
    };

    fetchStatusAndNotification();
  }, [petId]);

  // Functie om één veld (bv. is_eating) te togglen in de database en state
  const toggleStatus = async (field: keyof typeof defaultStatus) => {
    if (!status) return;

    const newValue = !status[field];

    // Optimistisch in UI: update status‐state
    setStatus((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: newValue };
    });
    setLastToggledField(field);

    // Schrijf wijziging naar Supabase
    const { error } = await supabase
      .from("ar_dog")
      .update({ [field]: newValue })
      .eq("id", status.id);

    if (error) {
      console.error("❌ Failed to update status:", error.message);
      // Rollback state als update faalt
      setStatus((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: !newValue };
      });
    }
  };

  // Terwijl we nog laden, of als `status` nog null is, tonen we een loader
  if (loading || !status) {
    return (
      <SafeAreaView>
        <View style={{ padding: 20, alignItems: "center" }}>
          <FontAwesome6 name="hourglass" size={32} />
          <Text style={{ marginTop: 10 }}>⏳ Loading...</Text>
          <Text style={{ marginTop: 10 }}>petId: {petId || "undefined"}</Text>
          <Text>Status: {JSON.stringify(status)}</Text>
          <Text>Loading: {String(loading)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // HONDNAAM (voor ‘{name}’-placeholder in status‐berichten)
  const dogName = status.name || "je hond";

  // 𝗦𝗧𝗔𝗧𝗨𝗦‐𝗕𝗘𝗥𝗢𝗢𝗥𝗗𝗦𝗖𝗛𝗔𝗣𝗣𝗘𝗡 (⇢ enkel de ‘true’-berichten, de ‘false’-berichten staan gecommentarieerd ter referentie)
  const getStatusMessages = (dogName: string) => ({
    is_eating: {
      true: `${dogName} heeft flink zijn eten opgegeten!`,
      // false: `Na ${dogName} zijn dutje, heeft hij hele grote honger gekregen!`,
    },
    is_playing: {
      true: `${dogName} heeft kunnen spelen!`,
      // false: `${dogName} heeft een tennisbal gevonden en wil spelen!`,
    },
    is_running: {
      true: `${dogName} vond het wandelen heel leuk!`,
      // false: `${dogName} heeft nood aan beweging, maak een wandeling!`,
    },
    is_toilet: {
      true: `${dogName} heeft zijn behoefte kunnen doen!`,
      // false: `${dogName} moet heel dringend naar het toilet, laat hem buiten!`,
    },
  });

  // In welke volgorde willen we péllen (priority) voor “welk veld het eerst getoond wordt” zodra er meerdere true zouden komen (meestal is er er maar 1)
  const fieldPriority: (keyof typeof defaultStatus)[] = [
    "is_eating",
    "is_playing",
    "is_running",
    "is_toilet",
  ];

  // 𝗚𝗘𝗧 𝗗𝗘 𝗢𝗡𝗧𝗛𝗔𝗟𝗘𝗡𝗘 “𝗧𝗘𝗞𝗦𝗧𝗕𝗔𝗟𝗟𝗢𝗡𝗘𝗡” (summary of status)
  const getCurrentMessages = (): string[] => {
    const statusMessagesMap = getStatusMessages(dogName);

    // 1) Als er een ongelezen `notificationSummary` in state staat, toon **alleen** die ballon
    if (notificationSummary) {
      return [notificationSummary];
    }

    // 2) Anders: loop in volgorde van fieldPriority, en toon de eerste status die wél op true staat
    for (const field of fieldPriority) {
      if (status[field]) {
        return [statusMessagesMap[field].true];
      }
    }

    // 3) Indien géén enkel veld true, toon geen ballon
    return [];
  };

  // 𝗕𝗨𝗧𝗧𝗢𝗡𝗦: vier icon‐knoppen, elk hoort bij één veld
  const buttons: { field: keyof typeof defaultStatus; icon: any }[] = [
    { field: "is_eating", icon: "bowl-food" },
    { field: "is_playing", icon: "baseball" },
    { field: "is_running", icon: "person-running" },
    { field: "is_toilet", icon: "poop" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
      {/* 𝗔𝗥-𝗪𝗘𝗥𝗞𝗘𝗡𝗗𝗘 𝗦𝗜𝗠𝗨𝗟𝗔𝗧𝗜𝗘 𝗧𝗘𝗞𝗦𝗧 (de huidige placeholder) */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 18,
            color: "#183A36",
            padding: 20,
            textAlign: "center",
          }}
        >
          De AR-weergave van je hond is tijdelijk uitgeschakeld tijdens
          development. Activeer dit later opnieuw om AR-functies te testen.
        </Text>
      </View>

      {/* 𝗧𝗘𝗞𝗦𝗧𝗕𝗔𝗟𝗟𝗢𝗡𝗘𝗡 𝗕𝗢𝗩𝗘𝗡𝗔𝗔𝗡 (eventuele summary óf één statusbericht) */}
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
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {getCurrentMessages().map((msg, idx) => (
          <Text
            key={idx}
            style={{
              margin: 6,
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: "#FDE4D2",
              padding: 12,
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              color: "#183A36",
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        ))}
      </View>

      {/* 𝗞𝗡𝗢𝗣𝗣𝗘𝗡 (is_eating / is_playing / is_running / is_toilet) */}
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
          width: "100%",
          paddingBottom: 100,
        }}
      >
        {buttons.map(({ field, icon }, index) => (
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

      {/* 𝗡𝗔𝗩𝗜𝗚𝗔𝗧𝗜𝗘𝗕𝗔𝗥 𝗢𝗡𝗗𝗘𝗥𝗔𝗔𝗡 */}
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

export default AugumentedDog;
