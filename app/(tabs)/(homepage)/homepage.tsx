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
import { Session } from "@supabase/supabase-js";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import NavBar from "@/components/NavigationBar";
import { useFocusEffect } from '@react-navigation/native';

export default function HomepageScreen() {
  const [firstname, setFirstname] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => authListener?.subscription?.unsubscribe();
  }, []);

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
        } catch (error: any) {
          Alert.alert("Error", error.message || "Kon profiel niet laden");
        }
      };
      getFirstname();
    } else {
      setFirstname("Guest");
    }
  }, [session]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDF9" }}>
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#97B8A5", position: "relative", paddingBottom: 80 }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontFamily: "Sirenia", fontWeight: "semibold", fontSize: 24, padding: 20, marginTop: 50, marginBottom: 30 }}>
          Welkom {firstname || "guest"}!
        </Text>
      </View>

      <View style={{ position: "absolute", top: 70, right: 30 }}>
        <Link href="/notifications_home">
          <View style={{ position: "relative" }}>
            <FontAwesome name="envelope-o" size={30} color="#183A36" />
            {unreadCount > 0 && (
              <View style={{
                position: "absolute",
                top: -6,
                right: -6,
                backgroundColor: "#F18B7E",
                borderRadius: 10,
                paddingHorizontal: 5,
                minWidth: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Text style={{ color: "#183A36", fontSize: 12, fontWeight: "bold" }}>
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
          padding: 20,
          maxWidth: "100%",
          paddingVertical: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "semibold",
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
              fontFamily: "Nunito",
              fontWeight: "normal",
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
              fontFamily: "Nunito",
              fontWeight: "normal",
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
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 20,
              padding: 20,
              marginRight: 10,
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
                  fontWeight: "bold",
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
                  fontFamily: "Nunito",
                  fontWeight: "normal",
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
              fontFamily: "Nunito",
              fontWeight: "normal",
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
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 20,
              padding: 20,
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
            }}
          >
            <TouchableOpacity
              onPress={handleHeartClick}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <FontAwesome
                name={isFilled ? "heart" : "heart-o"} // Conditional rendering for filled/outline heart
                size={20}
                color={isFilled ? "#183A36" : "#183A36"} // Color for filled and outlined hearts
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
                  }}
                >
                  Naam:
                </Text>
                <Text>Basiel</Text>
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
                  }}
                >
                  leeftijd:
                </Text>
                <Text>4 jaar</Text>
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
                  }}
                >
                  Ras:
                </Text>
                <Text>Labrador retriever</Text>
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
                  }}
                >
                  Asiel:
                </Text>
                <Text
                  style={{
                    paddingRight: 150,
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
            }}
          >
            <TouchableOpacity
              onPress={handleHeartClick}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <FontAwesome
                name={isFilled ? "heart" : "heart-o"} // Conditional rendering for filled/outline heart
                size={20}
                color={isFilled ? "#183A36" : "#183A36"} // Color for filled and outlined hearts
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
                  }}
                >
                  Naam:
                </Text>
                <Text>Basiel</Text>
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
                  }}
                >
                  leeftijd:
                </Text>
                <Text>4 jaar</Text>
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
                  }}
                >
                  Ras:
                </Text>
                <Text>Labrador retriever</Text>
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
                  }}
                >
                  Asiel:
                </Text>
                <Text
                  style={{
                    paddingRight: 150,
                  }}
                >
                  Dierenbescherming Mechelen
                </Text>
              </View>
            </View>
          </View>
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
