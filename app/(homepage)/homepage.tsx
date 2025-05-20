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

      // 1. Haal voornaam op
      const { data: profile } = await supabase
        .from("profiles")
        .select("firstname")
        .eq("id", session.user.id)
        .single();

      setFirstname(profile?.firstname || "Gast");

      // 2. Haal gematchte honden op met alias
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

      console.log("🐾 MATCHED DOGS:", matches);

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

        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
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
                {/* Als je images later wilt tonen, haal deze uit commentaar */}
                {/* {dog.images?.[0] && (
                  <Image
                    source={{ uri: dog.images[0] }}
                    style={{ width: "100%", height: 180, borderRadius: 12 }}
                  />
                )} */}
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}
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
