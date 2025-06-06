"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BaseText from "@/components/BaseText";
import { useFonts } from 'expo-font';
import { useRouter } from "expo-router";

// ** Importeren we de functie om de badge‐update‐callback te registreren **
import { registerBadgeCallback } from "@/app/_layout";

export default function HomepageScreen() {
const [fontsLoaded] = useFonts({
    "NunitoRegular": require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    "NunitoSemiBold": require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    "NunitoBold": require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    'SireniaMedium': require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }


  const [session, setSession] = useState<Session | null>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [matchedDogs, setMatchedDogs] = useState<any[]>([]);
  const [likedDogIds, setLikedDogIds] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const [dogId, setDogId] = useState<string | null>(null);
  const router = useRouter();
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

      if (!session?.user?.id) return setLoading(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("firstname")
        .eq("id", session.user.id)
        .single();

      setFirstname(profile?.firstname || "Gast");

      const { data: matches, error } = await supabase
        .from("adoption_matches")
        .select("match_score, adoption_dogs:dog_id(*)")
        .eq("user_id", session.user.id)
        .gte("match_score", 50)
        .order("match_score", { ascending: false });

      if (error) {
        console.error("❌ Fout bij ophalen matches:", error.message);
        Alert.alert("Fout", "Kon geen matches ophalen");
        setLoading(false);
        return;
      }

      const dogs = matches?.map((m) => m.adoption_dogs).filter(Boolean) || [];
      setMatchedDogs(dogs);

      const { data: liked } = await supabase
        .from("liked_dogs")
        .select("dog_id")
        .eq("user_id", session.user.id);

      setLikedDogIds(liked?.map((l) => l.dog_id) || []);
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
    }
  }, [session]);

  const toggleLike = async (dogId: string) => {
    const userId = session?.user?.id;
    if (!userId) return;

    const alreadyLiked = likedDogIds.includes(dogId);

    if (alreadyLiked) {
      const { error } = await supabase
        .from("liked_dogs")
        .delete()
        .match({ user_id: userId, dog_id: dogId });

      if (!error) {
        setLikedDogIds((prev) => prev.filter((id) => id !== dogId));
      }
    } else {
      const { error } = await supabase
        .from("liked_dogs")
        .insert({ user_id: userId, dog_id: dogId });

      if (!error) {
        setLikedDogIds((prev) => [...prev, dogId]);
      }
    }
  };

  const getAgeInYears = (birthdate: string) => {
    const birth = new Date(birthdate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    return m < 0 || (m === 0 && now.getDate() < birth.getDate())
      ? age - 1
      : age;
  };

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

      }}
    >
      <View style={{ alignItems: "center" }}>
        <BaseText
          style={{
            fontFamily: "SireniaMedium",
            fontSize: 28,
            padding: 20,
            marginTop: 50,
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
                    fontFamily: "NunitoBold",
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
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{
          backgroundColor: "#FFFDF9",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          marginTop: 50,
        }}
      >
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
              fontWeight: "bold",
              fontSize: 18,
              padding: 20,
              paddingRight: 40,
              marginRight: 10,
              color: "#183A36",
            }}
          >
            Jouw matches
          </Text>
          {matchedDogs.length === 0 ? (
            <>
              <Text
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "normal",
                  fontSize: 14,
                  paddingLeft: 20,
                  paddingRight: 20,
                  color: "#183A36",
                }}
              >
                Je hebt nog geen profiel ingevuld of er zijn nog geen geschikte
                matches.
              </Text>
              <Link
                href="/adoptionChoice"
                style={{
                  padding: 12,
                  margin: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  backgroundColor: "#97B8A5",
                  fontWeight: "bold",
                  fontSize: 15,
                  borderRadius: 15,
                  textAlign: "center",
                  color: "#FFFDF9",
                  width: "90%",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text
                    style={{
                      color: "#183A36",
                      fontFamily: "Nunito-Bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Vul je profiel in
                  </Text>
                  <Text style={{ color: "#183A36" }}>Basiel</Text>
                </View>
              </Link>
            </>
          ) : (
            matchedDogs.map((dog) => (
              <View
                key={dog.id}
                style={{
                  backgroundColor: "#FDE4D2",
                  borderRadius: 20,
                  marginBottom: 24,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "95%",
                  alignSelf: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginRight: 16,
                    backgroundColor: "#FFFDF9",
                  }}
                >
                  {dog.images?.length ? (
                    <Image
                      source={{
                        uri: dog.images[0],
                      }}
                      resizeMode="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Image
                      source={require("@/assets/images/logo_felicks.png")}
                      resizeMode="contain"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Link href={`/dog-detail/${dog.id}`} asChild>
                    <TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: "NunitoBold",
                          fontSize: 18,
                          marginBottom: 4,
                          color: "#183A36",
                        }}
                      >
                        {dog.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "NunitoRegular",
                          fontSize: 14,
                          color: "#183A36",
                        }}
                      >
                        <Text style={{ fontFamily: "NunitoMedium" }}>
                          Geboren op:{" "}
                        </Text>
                        {new Date(dog.birthdate).toLocaleDateString("nl-BE")} –{" "}
                        {getAgeInYears(dog.birthdate)} jaar
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Nunito-Regular",
                          fontSize: 14,
                          color: "#183A36",
                        }}
                      >
                        <Text style={{ fontFamily: "NunitoMedium" }}>
                          Ras:{" "}
                        </Text>
                        {dog.breed}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "NunitoRegular",
                          fontSize: 14,
                          color: "#183A36",
                        }}
                      >
                        <Text style={{ fontFamily: "NunitoMedium" }}>
                          Asiel:{" "}
                        </Text>
                        {dog.shelter}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
                <View style={{ position: "absolute", top: 10, right: 10 }}>
                  <TouchableOpacity onPress={() => toggleLike(dog.id)}>
                    <Ionicons
                      name={
                        likedDogIds.includes(dog.id) ? "heart" : "heart-outline"
                      }
                      size={22}
                      color="#183A36"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <NavBar />
    </SafeAreaView>
  );
}
