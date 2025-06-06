// app/(tabs)/(homepage)/homepage.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { useFocusEffect } from "@react-navigation/native";
import BaseText from "@/components/BaseText";

// ** Importeren we de functie om de badge‐update‐callback te registreren **
import { registerBadgeCallback } from "@/app/_layout";

export default function HomepageScreen() {
  const [firstname, setFirstname] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const [dogId, setDogId] = useState<string | null>(null);
  const handleHeartClick = () => setIsFilled(!isFilled);

  // ─── Functie: (opnieuw) tellen ongelezen meldingen
  const fetchUnreadNotifications = useCallback(async () => {
    console.log("[Homepage] fetchUnreadNotifications() start");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Haal dogId
    const { data: dog, error: dogError } = await supabase
      .from("ar_dog")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (dogError || !dog) {
      console.warn("[Homepage] Geen ar_dog gevonden:", dogError);
      setDogId(null);
      setUnreadCount(0);
      return;
    }
    setDogId(dog.id);

    // Tel ongelezen meldingen:
    const { data, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact" })
      .or(
        `pet_id.eq.${dog.id},and(category.eq.adoption_status,user_id.eq.${user.id})`
      )
      .eq("is_read", false);

    if (error || !data) {
      console.warn("[Homepage] Fout bij ophalen ongelezen:", error);
      setUnreadCount(0);
      return;
    }
    console.log("[Homepage] ongelezen teller:", data.length);
    setUnreadCount(data.length);
  }, []);

  // ─── TEL ongelezen MELDINGEN telkens dit scherm focus krijgt ────────────────
  useFocusEffect(
    useCallback(() => {
      fetchUnreadNotifications();
    }, [fetchUnreadNotifications])
  );

  // ─── REGISTREER de badge‐update‐callback (zodat helper het kan aanroepen)
  useEffect(() => {
    console.log("[Homepage] registerBadgeCallback gestart");
    registerBadgeCallback(fetchUnreadNotifications);

    // **Nieuw:** direct 1× fetchUnreadNotifications, zodat badge up‐todate is na herstart
    fetchUnreadNotifications();

    // (optioneel: cleanup) return () => registerBadgeCallback(() => {});
  }, [fetchUnreadNotifications]);

  // ─── Haal session op ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, newSession) => {
        setSession(newSession);
        setLoading(false);
      }
    );
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ─── Haal voornaam op ──────────────────────────────────────────────────────
  useEffect(() => {
    if (session?.user) {
      const getFirstname = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("firstname")
            .eq("id", session.user.id)
            .single();
          if (error) throw error;
          setFirstname(data?.firstname || "Guest");
        } catch (err: any) {
          Alert.alert("Error", err.message || "Kon profiel niet laden");
        }
      };
      getFirstname();
    } else {
      setFirstname("Guest");
    }
  }, [session]);

  // ** Belangrijk: er staat écht geen eigen subscribe() meer in deze file **
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFDF9",
        }}
      >
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#cbdacf",
        position: "relative",
        paddingBottom: 80,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <BaseText
          style={{
            fontFamily: "SireniaMedium",
            fontSize: 28,
            padding: 20,
            marginTop: 50,
            marginBottom: 30,
          }}
        >
          Welkom {firstname || "guest"}!
        </BaseText>
      </View>

      <View style={{ position: "absolute", top: 70, right: 30 }}>
        <Link href="/notificationsIndex">
          <View style={{ position: "relative" }}>
            <FontAwesome name="envelope-o" size={30} color="#183A36" />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: "#F18B7E",
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  minWidth: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#183A36",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </Link>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        style={{
          backgroundColor: "#FFFDF9",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxWidth: "100%",
          paddingVertical: 20,
        }}
      >
        {/* ─── jouw bestaande homepage‐content (quiz, bewustzijn, lijst, enz.) ─── */}
        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 18,
              padding: 20,
              paddingRight: 40,
              marginRight: 10,
              color: "#183A36",
            }}
          >
            Quiz van de week
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 20,
              paddingRight: 40,
              paddingBottom: 20,
              color: "#183A36",
            }}
          >
            Ben jij klaar voor een hond? Doe de test!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 20,
              paddingRight: 40,
              color: "#183A36",
            }}
          >
            Doe nog snel de quiz van deze week, voor je informatie misloopt.
          </Text>
          <Link
            href="/quizIndex"
            style={{
              padding: 12,
              margin: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
              backgroundColor: "#F18B7E",
              fontWeight: "bold",
              fontSize: 15,
              borderRadius: 15,
              textAlign: "center",
              color: "#FFFDF9",
              width: "90%",
              alignItems: "center",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            START DE QUIZ
          </Link>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 18,
              padding: 20,
              marginRight: 10,
              color: "#183A36",
            }}
          >
            Bewustzijn
          </Text>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 20,
              paddingRight: 40,
              paddingBottom: 20,
              color: "#183A36",
            }}
          >
            Denk je eraan een hond te nemen?
          </Text>
          <View
            style={{
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "row",
              maxWidth: "100%",
            }}
          >
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#97B8A5",
                marginLeft: 20,
              }}
              source={{
                uri: "https://letsgokids.co.nz/wp-content/uploads/2024/03/Pet-First-Aid-Kits-3.jpg",
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "semibold",
                  fontSize: 18,
                  paddingLeft: 20,
                  paddingRight: 150,
                  paddingBottom: 8,
                  color: "#183A36",
                }}
              >
                EHBO voor honden: wat moet je weten?
              </Text>
              <Text
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "normal",
                  fontSize: 14,
                  paddingLeft: 20,
                  paddingRight: 160,
                  color: "#183A36",
                }}
              >
                Je hond kan gewond raken of ziek worden. Met een paar
                EHBO-vaardigheden ben jij de redder in nood!
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 16,
              paddingLeft: 20,
              color: "#183A36",
              marginTop: 10,
            }}
          >
            Lees eerst wat je moet weten over hondenbezit.
          </Text>
          <Link
            href="/artikelsIndex"
            style={{
              padding: 12,
              margin: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
              backgroundColor: "#FFD87E",
              fontWeight: "bold",
              fontSize: 15,
              borderRadius: 15,
              textAlign: "center",
              color: "#183A36",
              width: "90%",
              alignItems: "center",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            LEES MEER TIPS
          </Link>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 20,
              padding: 20,
              color: "#183A36",
            }}
          >
            Deze honden passen bij jouw profiel:
          </Text>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: 4,
              backgroundColor: "#FDE4D2",
              padding: 10,
              borderRadius: 20,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleHeartClick}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <FontAwesome
                name={isFilled ? "heart" : "heart-o"}
                size={20}
                color="#183A36"
              />
            </TouchableOpacity>
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                marginBottom: 10,
                marginRight: 4,
              }}
              source={require("../../../assets/images/dogfoto1.png")}
            />
            <View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  Naam:
                </Text>
                <Text style={{ color: "#183A36" }}>Basiel</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  leeftijd:
                </Text>
                <Text style={{ color: "#183A36" }}>4 jaar</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  Ras:
                </Text>
                <Text style={{ color: "#183A36" }}>Labrador retriever</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  Asiel:
                </Text>
                <Text
                  style={{
                    paddingRight: 150,
                    color: "#183A36",
                  }}
                >
                  Dierenbescherming Mechelen
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: 4,
              backgroundColor: "#FDE4D2",
              padding: 10,
              borderRadius: 20,
              marginVertical: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleHeartClick}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <FontAwesome
                name={isFilled ? "heart" : "heart-o"}
                size={20}
                color="#183A36"
              />
            </TouchableOpacity>
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                marginBottom: 10,
                marginRight: 4,
              }}
              source={require("../../../assets/images/dogfoto2.png")}
            />
            <View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  Naam:
                </Text>
                <Text style={{ color: "#183A36" }}>Ollie</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  leeftijd:
                </Text>
                <Text style={{ color: "#183A36" }}>4 jaar</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  Ras:
                </Text>
                <Text style={{ color: "#183A36" }}>
                  Basset Fauve de Bretagne
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#183A36",
                  }}
                >
                  Asiel:
                </Text>
                <Text
                  style={{ paddingRight: 150, color: "#183A36" }}
                >
                  Dierenbescherming Mechelen
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navbar onderaan */}
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
}
