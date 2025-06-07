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
import { Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BaseText from "@/components/BaseText";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

import { registerBadgeCallback } from "@/app/_layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";

export default function HomepageScreen() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Keep loading state
  const [matchedDogs, setMatchedDogs] = useState<any[]>([]);
  const [likedDogIds, setLikedDogIds] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [dogId, setDogId] = useState<string | null>(null);
  const router = useRouter();

  // ─── Functie: (opnieuw) tellen ongelezen meldingen
  const fetchUnreadNotifications = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

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
    setUnreadCount(data.length);
  }, []); // Dependencies for useCallback: ensure they are stable or listed if they change

  // ─── TEL ongelezen MELDINGEN telkens dit scherm focus krijgt ────────────────
  useFocusEffect(
    useCallback(() => {
      fetchUnreadNotifications();
    }, [fetchUnreadNotifications])
  );

  // ─── REGISTREER de badge‐update‐callback (zodat helper het kan aanroepen)
  useEffect(() => {
    registerBadgeCallback(fetchUnreadNotifications);
    fetchUnreadNotifications(); // Initial fetch

    return () => registerBadgeCallback(() => {}); // Cleanup
  }, [fetchUnreadNotifications]);

  // ─── Haal session op ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSession = async () => {
      // Set loading to true at the start of data fetching,
      // but only if fonts are already loaded.
      // The main loading state will be handled after font check.
      if (fontsLoaded) setLoading(true);

      const {
        data: { session: currentSession }, // Renamed to avoid conflict
      } = await supabase.auth.getSession();

      setSession(currentSession);

      if (!currentSession?.user?.id) {
        if (fontsLoaded) setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("firstname")
        .eq("id", currentSession.user.id)
        .single();

      setFirstname(profile?.firstname || "Gast");

      const { data: matches, error } = await supabase
        .from("adoption_matches")
        .select("match_score, adoption_dogs:dog_id(*)")
        .eq("user_id", currentSession.user.id)
        .gte("match_score", 50)
        .order("match_score", { ascending: false });

      if (error) {
        console.error("❌ Fout bij ophalen matches:", error.message);
        Alert.alert("Fout", "Kon geen matches ophalen");
        if (fontsLoaded) setLoading(false);
        return;
      }

      const dogs = matches?.map((m) => m.adoption_dogs).filter(Boolean) || [];
      setMatchedDogs(dogs);

      const { data: liked } = await supabase
        .from("liked_dogs")
        .select("dog_id")
        .eq("user_id", currentSession.user.id);

      setLikedDogIds(liked?.map((l) => l.dog_id) || []);
      if (fontsLoaded) setLoading(false);
    };

    if (fontsLoaded) {
      // Only fetch session if fonts are loaded
      fetchSession();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, newSession) => {
        setSession(newSession);
        // Potentially re-fetch data or set loading based on newSession
        if (fontsLoaded) {
          if (newSession) {
            fetchSession(); // Re-fetch if session changes and fonts are loaded
          } else {
            setFirstname("");
            setMatchedDogs([]);
            setLikedDogIds([]);
            setLoading(false); // No session, stop loading
          }
        }
      }
    );
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fontsLoaded]); // Add fontsLoaded as a dependency

  // --- CONDITIONAL RETURNS CAN COME AFTER ALL HOOKS ---
  if (!fontsLoaded || loading) {
    // Combine loading checks
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFDF9", // Consistent background
        }}
      >
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }

  // --- Component Logic that uses state (AFTER hooks and loading checks) ---
  const handleHeartClick = () => setIsFilled(!isFilled); // This is fine here

  const toggleLike = async (dogIdToLike: string) => {
    // Renamed dogId to avoid conflict
    const userId = session?.user?.id;
    if (!userId) return;

    const alreadyLiked = likedDogIds.includes(dogIdToLike);

    if (alreadyLiked) {
      const { error } = await supabase
        .from("liked_dogs")
        .delete()
        .match({ user_id: userId, dog_id: dogIdToLike });

      if (!error) {
        setLikedDogIds((prev) => prev.filter((id) => id !== dogIdToLike));
      }
    } else {
      const { error } = await supabase
        .from("liked_dogs")
        .insert({ user_id: userId, dog_id: dogIdToLike });

      if (!error) {
        setLikedDogIds((prev) => [...prev, dogIdToLike]);
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

  // --- JSX Return ---
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#cbdacf",
        position: "relative",
      }}
    >
      {/* ... rest of your JSX ... */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 50,
          marginLeft: 90,
          gap: 20,
        }}
      >
        <BaseText
          style={{
            fontFamily: "SireniaMedium",
            fontSize: 28,
            paddingVertical: 20,
            textAlign: "center",
          }}
        >
          Welkom {firstname || "guest"}!
        </BaseText>

        <Link
          href="/notificationsIndex"
          style={{
            marginLeft: 40,
            marginRight: 20,
          }}
        >
          <View style={{ position: "relative", width: 30, height: 30 }}>
            <FontAwesomeIcon icon={faEnvelopeOpen} size={30} color="#183A36" />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#F18B7E",
                  borderRadius: 9,
                  paddingHorizontal: 4,
                  minWidth: 18,
                  height: 18,
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
          flex: 1,
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
              fontFamily: "NunitoBold",
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
              fontFamily: "NunitoRegular",
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
              fontFamily: "NunitoRegular",
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
              // padding: 12, // Use paddingVertical/Horizontal
              margin: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
              backgroundColor: "#F18B7E",
              borderRadius: 15,
              width: "90%",
              alignSelf: "center", // To center the button
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "NunitoBold",
                fontSize: 15,
                textAlign: "center",
                color: "#FFFDF9",
              }}
            >
              START DE QUIZ
            </Text>
          </Link>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "NunitoBold",
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
              fontFamily: "NunitoRegular",
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
              alignItems: "flex-start", // Changed to flex-start for image and text block
              display: "flex",
              flexDirection: "row",
              maxWidth: "100%",
              paddingHorizontal: 20, // Added padding to the row
              marginBottom: 10,
            }}
          >
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                // marginBottom: 10, // Removed, spacing handled by parent
                borderWidth: 1,
                borderColor: "#97B8A5",
                // marginLeft: 20, // Removed, spacing handled by parent
                marginRight: 15, // Space between image and text
              }}
              source={{
                uri: "https://letsgokids.co.nz/wp-content/uploads/2024/03/Pet-First-Aid-Kits-3.jpg",
              }}
            />
            <View style={{ flex: 1 }}>
              {/* Allow text block to take remaining space */}
              <Text
                style={{
                  fontFamily: "NunitoSemiBold",
                  fontSize: 18,
                  // paddingLeft: 20, // Removed, spacing handled by parent
                  // paddingRight: 150, // Removed, flex:1 will manage width
                  paddingBottom: 8,
                  color: "#183A36",
                }}
              >
                EHBO voor honden: wat moet je weten?
              </Text>
              <Text
                style={{
                  fontFamily: "NunitoRegular",
                  fontSize: 14,
                  // paddingLeft: 20, // Removed
                  // paddingRight: 160, // Removed
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
              fontFamily: "NunitoRegular",
              fontSize: 16,
              paddingHorizontal: 20, // Added horizontal padding
              color: "#183A36",
              marginTop: 10,
            }}
          >
            Lees eerst wat je moet weten over hondenbezit.
          </Text>
          <Link
            href="/artikelsIndex"
            style={{
              paddingVertical: 15, // Combined padding
              margin: 20,
              backgroundColor: "#FFD87E",
              borderRadius: 15,
              width: "90%",
              alignSelf: "center",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "NunitoBold",
                fontSize: 15,
                textAlign: "center",
                color: "#183A36",
              }}
            >
              LEES MEER TIPS
            </Text>
          </Link>
        </View>

        <View
          style={{
            marginBottom: 40, // Added margin for spacing
          }}
        >
          <Text
            style={{
              fontFamily: "NunitoBold",
              fontSize: 18,
              padding: 20,
              // paddingRight: 40, // Removed for consistency
              // marginRight: 10, // Removed for consistency
              color: "#183A36",
            }}
          >
            Jouw matches
          </Text>
          {matchedDogs.length === 0 ? (
            <>
              <Text
                style={{
                  fontFamily: "NunitoRegular",
                  fontSize: 16,
                  paddingHorizontal: 20, // Added horizontal padding
                  color: "#183A36",
                  textAlign: "left", // Center this text
                  marginBottom: 10,
                }}
              >
                Je hebt nog geen profiel ingevuld of er zijn nog geen geschikte
                matches.
              </Text>
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
                  elevation: 1, // For Android shadow
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginRight: 16,
                    backgroundColor: "#FFFDF9", // Placeholder background
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
                    <Image // Fallback image
                      source={require("@/assets/images/logo_felicks.png")} // Ensure this path is correct
                      resizeMode="contain"
                      style={{
                        width: "80%",
                        height: "80%",
                        alignSelf: "center",
                        marginTop: "10%",
                      }} // Adjust for better display
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
                        <Text style={{ fontFamily: "NunitoSemiBold" }}>
                          {" "}
                          {/* Changed to SemiBold */}
                          Geboren op:{" "}
                        </Text>
                        {new Date(dog.birthdate).toLocaleDateString(
                          "nl-BE"
                        )} – {getAgeInYears(dog.birthdate)} jaar
                      </Text>
                      <Text
                        style={{
                          fontFamily: "NunitoRegular",
                          fontSize: 14,
                          color: "#183A36",
                        }}
                      >
                        <Text style={{ fontFamily: "NunitoSemiBold" }}>
                          {" "}
                          {/* Changed to SemiBold */}
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
                        <Text style={{ fontFamily: "NunitoSemiBold" }}>
                          {" "}
                          {/* Changed to SemiBold */}
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
                      color="#183A36" // Ensure good contrast
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <Link
            href="/adoptionChoice"
            style={{
              paddingVertical: 15, // Combined padding
              marginHorizontal: 20, // Horizontal margin
              marginBottom: 20, // Bottom margin
              backgroundColor: "#97B8A5",
              borderRadius: 15,
              width: "90%",
              alignSelf: "center",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Text component for styling Link content */}
            <Text
              style={{
                color: "#183A3", // Moved color here
                fontFamily: "NunitoBold",
                textTransform: "uppercase",
                // Ensure fontSize and textAlign are here if needed for the text itself
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Vind jouw match
            </Text>
          </Link>
        </View>
      </ScrollView>
      <NavBar />
    </SafeAreaView>
  );
}
