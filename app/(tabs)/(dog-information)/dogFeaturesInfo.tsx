import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";

export default function DogFeature() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFDF9",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 64,
            left: 16,
          }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 20,
            padding: 20,
            textAlign: "center",
          }}
        >
          Tijd om voor Cooper te zorgen!
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            padding: 20,
            marginRight: 10,
          }}
        >
          Welkom bij jouw virtuele hond, Cooper! Hier ontdek je hoe je voor hem kunt zorgen en hem gelukkig kunt maken.
        </Text>
        <View
        style={{
          marginRight: 10,
        }}>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
            }}
          >
            1. Navigatiehulp:
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 8,
              }}
            >
              De Home-knop brengt je altijd terug naar de startpagina.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 12,
                marginRight: 10,
              }}
            >
              Onderin vind je de opties om Cooper te voeren, spelen, wandelen en zelfs naar het toilet te laten gaan. 
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
            }}
          >
            2. Cooper's behoeften:
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 8,
                marginRight: 20,
              }}
            >
              Je ontvangt meldingen als Cooper iets nodig heeft, zoals eten of een wandeling. Het is jouw taak om goed voor hem te zorgen.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 12,
                marginRight: 20,
              }}
            >
              Vergeet niet: een gelukkige Cooper betekent een blije jij! 
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 18,
              padding: 20,
              paddingTop: 20,
              paddingBottom: 0,
            }}
          >
            3. Realistisch en interactief:
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 8,
                marginRight: 20,
              }}
            >
              Cooper reageert op hoe jij voor hem zorgt. Geef hem aandacht en hij zal stralen. Verwaarloos je hem? Dan zal hij minder gelukkig zijn. Het draait om échte verantwoordelijkheid.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 36,
                paddingRight: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingRight: 12,
                marginRight: 20,
              }}
            >
              Als je om welke reden dan ook wilt stoppen, kun je hem via de instellingen genoeg verwijderen. Maar wie zou zo'n schattig hondje willen laten gaan? 😉
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            padding: 20,
            paddingTop: 12,
          }}
        >
          Klaar om aan jullie avontuur te beginnen?
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            padding: 20,
            paddingTop: 12,
          }}
        >
           Druk op de knop hieronder en ontmoet je nieuwe beste vriend!
        </Text>
        <Link
          style={{
            padding: 12,
            paddingHorizontal: 4,
            margin: 20,
            marginRight: 45,
            backgroundColor: "#97B8A5",
            fontWeight: "bold",
            borderRadius: 15,
            textAlign: "center",
          }}
          href="/arLoader"
        >
          MAAK KENNIS MET JE NIEUWE VRIENDJE
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
