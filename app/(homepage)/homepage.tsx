"use client";

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useFonts } from "expo-font";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function HomepageScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [firstname, setFirstname] = useState("Gast");
  const [loading, setLoading] = useState(true);
  const [matchedDogs, setMatchedDogs] = useState<any[]>([]);
  const [likedDogIds, setLikedDogIds] = useState<string[]>([]);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Medium": require("@/assets/fonts/nunito/Nunito-Medium.ttf"),
    "Nunito-Bold": require("@/assets/fonts/nunito/Nunito-Bold.ttf"),
    "Sirenia-Regular": require("@/assets/fonts/Sirenia/SireniaRegular.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const getAgeInYears = (birthdate: string): number => {
    const birth = new Date(birthdate);
    const now = new Date();
    return Math.floor(
      (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
  };

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
      const { error } = await supabase.from("liked_dogs").insert({
        user_id: userId,
        dog_id: dogId,
      });

      if (!error) {
        setLikedDogIds((prev) => [...prev, dogId]);
      }
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#cadace" }}>
      <View style={{ position: "absolute", top: 70, right: 30 }}>
        <Link href="/">
          <FontAwesome name="envelope-o" size={28} color="#183A36" />
        </Link>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Sirenia-Regular",
            fontSize: 24,
            padding: 20,
            marginTop: 50,
            marginBottom: 30,
            color: "#183A36",
          }}
        >
          Welkom {firstname || "Gast"}!
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
        style={{
          backgroundColor: "#FFFDF9",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              marginBottom: 10,
              color: "#183A36",
            }}
          >
            Quiz van de week
          </Text>
          <Text
            style={{
              fontFamily: "Nunito-Regular",
              fontSize: 16,
              marginBottom: 6,
              color: "#183A36",
            }}
          >
            Ben jij klaar voor een hond? Doe de test!
          </Text>
          <Text
            style={{
              fontFamily: "Nunito-Regular",
              fontSize: 16,
              marginBottom: 12,
              color: "#183A36",
            }}
          >
            Doe nog snel de quiz van deze week, voor je informatie misloopt.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#F18B7E",
              padding: 12,
              borderRadius: 15,
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={() => router.push("/")}
          >
            <Text
              style={{
                color: "#FFFDF9",
                fontFamily: "Nunito-Bold",
                textTransform: "uppercase",
              }}
            >
              start de quiz
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              marginBottom: 10,
              color: "#183A36",
            }}
          >
            Bewustzijn
          </Text>
          <Text
            style={{
              fontFamily: "Nunito-Regular",
              fontSize: 16,
              marginBottom: 12,
              color: "#183A36",
            }}
          >
            Denk je eraan een hond te nemen?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#97B8A5",
                marginRight: 12,
              }}
              source={{
                uri: "https://letsgokids.co.nz/wp-content/uploads/2024/03/Pet-First-Aid-Kits-3.jpg",
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 6,
                  color: "#183A36",
                }}
              >
                EHBO voor honden: wat moet je weten?
              </Text>
              <Text style={{ fontSize: 12, color: "#183A36" }}>
                Je hond kan gewond raken of ziek worden. Met een paar
                EHBO-vaardigheden ben jij de redder in nood!
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, marginBottom: 10, color: "#183A36" }}>
            Lees eerst wat je moet weten over hondenbezit.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#FFD87E",
              padding: 12,
              borderRadius: 15,
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={() => router.push("/")}
          >
            <Text
              style={{
                color: "#183A36",
                fontFamily: "Nunito-Bold",
                textTransform: "uppercase",
              }}
            >
              Lees meer tips
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              marginBottom: 10,
              color: "#183A36",
            }}
          >
            Deze honden passen bij jouw profiel:
          </Text>
          {matchedDogs.length === 0 ? (
            <>
              <Text
                style={{
                  fontFamily: "Nunito-Regular",
                  fontSize: 16,
                  marginBottom: 10,
                  color: "#183A36",
                }}
              >
                Geen matches gevonden.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#97B8A5",
                  padding: 12,
                  borderRadius: 15,
                  alignItems: "center",
                  marginBottom: 20,
                  marginTop: 10,
                }}
                onPress={() =>
                  router.push("/(adoption_personality)/personality_traits")
                }
              >
                <Text
                  style={{
                    color: "#183A36",
                    fontFamily: "Nunito-Bold",
                    textTransform: "uppercase",
                  }}
                >
                  Vul je adoptieprofiel in
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            matchedDogs.map((dog) => (
              <View
                key={dog.id}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#FDE4D2",
                  borderRadius: 15,
                  padding: 12,
                  marginBottom: 16,
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(adoption_personality)/dog-detail/${dog.id}`)
                  }
                  style={{ flexDirection: "row", flex: 1 }}
                >
                  <View
                    style={{
                      width: 90,
                      backgroundColor: "#FFFDF9",
                      borderRadius: 10,
                      marginRight: 12,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "stretch",
                    }}
                  >
                    <Image
                      source={require("@/assets/images/logo_felicks.png")}
                      style={{ width: 75, height: 75, resizeMode: "contain" }}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 18,
                        marginBottom: 4,
                        color: "#183A36",
                      }}
                    >
                      {dog.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito-Regular",
                        fontSize: 14,
                        marginBottom: 2,
                        color: "#183A36",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Medium",
                          color: "#183A36",
                        }}
                      >
                        Geboren op:{" "}
                      </Text>
                      {new Date(dog.birthdate).toLocaleDateString("nl-BE")} –{" "}
                      {getAgeInYears(dog.birthdate)} jaar
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito-Regular",
                        fontSize: 14,
                        marginBottom: 2,
                        color: "#183A36",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Medium",
                          color: "#183A36",
                        }}
                      >
                        Ras:{" "}
                      </Text>
                      {dog.breed}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito-Regular",
                        fontSize: 14,
                        marginBottom: 2,
                        color: "#183A36",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Medium",
                          color: "#183A36",
                        }}
                      >
                        Geslacht:{" "}
                      </Text>
                      {dog.gender === "male" ? "Reu" : "Teef"}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito-Regular",
                        fontSize: 14,
                        color: "#183A36",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Medium",
                          color: "#183A36",
                        }}
                      >
                        Asiel:{" "}
                      </Text>
                      {dog.shelter}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={{ position: "absolute", top: 10, right: 12 }}>
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
