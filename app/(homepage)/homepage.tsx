"use client";

import React, { useEffect, useState } from "react";
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
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, Link } from "expo-router";
import NavBar from "@/components/NavigationBar";

export default function HomepageScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [firstname, setFirstname] = useState("Gast");
  const [loading, setLoading] = useState(true);
  const [matchedDogs, setMatchedDogs] = useState<any[]>([]);
  const router = useRouter();

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
      setLoading(false);
    };

    fetchData();
  }, []);

  const getAgeCategory = (birthdate: string): string => {
    const birth = new Date(birthdate);
    const now = new Date();
    const age =
      (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 1) return "Puppy";
    if (age < 3) return "Jonge hond";
    if (age < 8) return "Volwassen hond";
    return "Senior";
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF9" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text
          style={{
            fontFamily: "Sirenia",
            fontWeight: "semibold",
            fontSize: 24,
            textAlign: "center",
            padding: 20,
          }}
        >
          Welkom {firstname}!
        </Text>

        {/* Quiz van de week */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>
            Quiz van de week
          </Text>
          <Text style={{ fontSize: 16 }}>
            Ben jij klaar voor een hond? Doe de test!
          </Text>
          <Text style={{ fontSize: 14, marginVertical: 8 }}>
            Doe nog snel de quiz van deze week, voor je informatie misloopt.
          </Text>
          <Link
            href="/(adoption_personality)/personality_traits"
            style={{
              backgroundColor: "#F18B7E",
              color: "#FFFDF9",
              padding: 12,
              borderRadius: 15,
              textAlign: "center",
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            START DE QUIZ
          </Link>
        </View>

        {/* Bewustzijn */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>
            Bewustzijn
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            Denk je eraan een hond te nemen?
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginVertical: 10,
            }}
          >
            <Image
              source={{
                uri: "https://letsgokids.co.nz/wp-content/uploads/2024/03/Pet-First-Aid-Kits-3.jpg",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                borderColor: "#97B8A5",
                borderWidth: 1,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold" }}>
                EHBO voor honden: wat moet je weten?
              </Text>
              <Text style={{ fontSize: 13 }}>
                Je hond kan gewond raken of ziek worden. Met een paar
                EHBO-vaardigheden ben jij de redder in nood!
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, marginBottom: 4 }}>
            Lees eerst wat je moet weten over hondenbezit.
          </Text>

          <Link
            href="/"
            style={{
              backgroundColor: "#FFD87E",
              padding: 12,
              borderRadius: 15,
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 10,
              display: "flex",
            }}
          >
            LEES MEER TIPS
          </Link>
        </View>

        {/* Profiel-matches */}
        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Deze honden passen bij jouw profiel:
          </Text>

          {matchedDogs.length === 0 ? (
            <>
              <Text style={{ fontSize: 16 }}>
                Je hebt nog geen profiel ingevuld of er zijn geen matches.
              </Text>
              <Link
                href="/(adoption_personality)/personality_traits"
                style={{
                  backgroundColor: "#F18B7E",
                  padding: 12,
                  borderRadius: 15,
                  color: "#FFFDF9",
                  marginTop: 10,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Vul je profiel in
              </Link>
            </>
          ) : (
            matchedDogs.map((dog) => (
              <TouchableOpacity
                key={dog.id}
                onPress={() =>
                  router.push(
                    `/(adoption_personality)/dog-detail/${dog.id}` as any
                  )
                }
                style={{
                  flexDirection: "column",
                  backgroundColor: "#FDE4D2",
                  marginVertical: 8,
                  borderRadius: 15,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 4,
                  }}
                >
                  {dog.name}
                </Text>
                <Text>Ras: {dog.breed}</Text>
                <Text>Leeftijd: {getAgeCategory(dog.birthdate)}</Text>
                <Text>Asiel: {dog.shelter}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <NavBar />
    </SafeAreaView>
  );
}
