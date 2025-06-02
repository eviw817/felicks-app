import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from "react-native";
import { useFonts } from "expo-font";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

export default function HomepageScreen() {

  const [session, setSession] = useState<Session | null>(null);
  const [firstname, setFirstname] = useState("Gast");
  const [loading, setLoading] = useState(true);
  const [matchedDogs, setMatchedDogs] = useState<any[]>([]);
  const [likedDogIds, setLikedDogIds] = useState<string[]>([]);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    SireniaSemiBold: require("@/assets/fonts/Sirenia/SireniaSemiBold.ttf"),
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const handleHeartClick = () => setIsFilled(!isFilled);

  const fetchUnreadNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: dog } = await supabase
      .from("ar_dog")
      .select("id")
      .eq("user_id", user?.id)
      .single();

    if (dog) {
      const { data, error } = await supabase
        .from("notifications")
        .select("id")
        .eq("pet_id", dog.id)
        .eq("is_read", false);

      if (!error && data) {
        setUnreadCount(data.length);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadNotifications();
    }, [fetchUnreadNotifications])
  );

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#97B8A5",
        position: "relative",
        paddingBottom: 80,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "SireniaSemiBold",
            fontSize: 24,
            padding: 20,
            marginTop: 50,
            marginBottom: 30,
          }}
        >
          Welkom {firstname || "guest"}!
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          top: 70,
          right: 30,
        }}
      >
        <Link href="/notificationsIndex">
          <FontAwesome
            name="envelope-o"
            size={30} // Icon size
            color="#183A36" // Icon color
          />
        </Link>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        style={{
          backgroundColor: "#FFFDF9",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          maxWidth: "100%",
          paddingVertical: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "NunitoSemiBold",
              fontSize: 20,
              padding: 20,
              paddingRight: 40,
              marginRight: 10,
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
              backgroundColor: "#F18B7E",
              fontWeight: "bold",
              borderRadius: 15,
              textAlign: "center",
              color: "#FFFDF9",
            }}
          >
            START DE QUIZ
          </Link>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "NunitoSemiBold",
              fontSize: 20,
              padding: 20,
              marginRight: 10,
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
                  fontFamily: "NunitoBold",
                  fontSize: 16,
                  paddingLeft: 20,
                  paddingRight: 150,
                  paddingBottom: 8,
                }}
              >
                EHBO voor honden: wat moet je weten?
              </Text>
              <Text
                style={{
                  fontFamily: "NunitoRegular",
                  fontSize: 12,
                  paddingLeft: 20,
                  paddingRight: 140,
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
              fontSize: 14,
              paddingLeft: 20,
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
              backgroundColor: "#FFD87E",
              fontWeight: "bold",
              borderRadius: 15,
              textAlign: "center",
            }}
          >
            LEES MEER TIPS
          </Link>
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
                onPress={() => router.push("/homepage")}
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
                  onPress={() => router.push(`/`)}
                  style={{ flexDirection: "row", flex: 1 }}
                >
                  <View
                    style={{
                      width: 110,
                      height: 110,
                      backgroundColor: "#FFFDF9",
                      borderRadius: 10,
                      marginRight: 12,
                      justifyContent: "center", // logo mooi centreren
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {dog.images?.length ? (
                      <Image
                        source={{
                          uri: `https://vgbuoxdfrbzqbqltcelz.supabase.co/storage/v1/object/public/${dog.images[0]}`,
                        }}
                        resizeMode="cover"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <Image
                        source={require("@/assets/images/logo_felicks.png")}
                        resizeMode="contain"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 8,
                        }}
                      />
                    )}
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
      {/* Fixed navbar onderaan scherm */}
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
