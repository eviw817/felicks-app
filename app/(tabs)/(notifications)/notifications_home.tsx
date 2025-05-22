import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, Text, View, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { supabase } from "../../../lib/supabase";
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router'; 
import { Link } from 'expo-router';
import NavBar from "../../../components/NavigationBar";


export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#FFFDF9",
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 98,
            left: 16,
            maxWidth: "100%",
          }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Sirenia",
              fontWeight: "semibold",
              fontSize: 24,
              padding: 20,
              marginTop: 70,
            }}
          >
            Meldingen
          </Text>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito",
              fontWeight: "semibold",
              fontSize: 20,
              padding: 10,
            }}
          >
            Recente meldingen
          </Text>
          <View
            style={{
              marginVertical: 10,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                marginRight: 4,
              }}
              source={require("../../../assets/images/cooper-profile.png")}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                gap: 4,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <FontAwesome
                  name="exclamation-triangle"
                  size={20}
                  color="#F18B7E"
                />
                <Text
                  style={{
                    color: "#F18B7E",
                  }}
                >
                  Cooper moet naar het toilet
                </Text>
              </View>
              <Text
                style={{
                  marginRight: 80,
                  color: "#183A36",
                }}
              >
                Als Cooper nog lang moet wachten, is de kans dat hij zijn
                boodschap binnen doet groot
              </Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                marginRight: 4,
              }}
              source={require("../../../assets/images/cooper-profile.png")}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                gap: 4,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <FontAwesome
                  name="exclamation-triangle"
                  size={20}
                  color="#F18B7E"
                />
                <Text
                  style={{
                    color: "#F18B7E",
                  }}
                >
                  Cooper moet gaan wandelen
                </Text>
              </View>
              <Text
                style={{
                  marginRight: 80,
                  color: "#183A36",
                }}
              >
                Als Cooper geen fysieke uitdaging krijgt, gaat hij
                waarschijnlijk beginnen bijten aan je meubelen, kleren,
                schoenen, ...
              </Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                marginRight: 4,
              }}
              source={require("../../../assets/images/dogfoto1.png")}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                gap: 4,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <FontAwesome
                  name="exclamation-triangle"
                  size={20}
                  color="#F18B7E"
                />
                <Text
                  style={{
                    color: "#F18B7E",
                  }}
                >
                  Status verandering in je dossier{" "}
                </Text>
              </View>
              <Text
                style={{
                  marginRight: 80,
                  color: "#183A36",
                }}
              >
                Er is een update in je adoptieaanvraag! Voor meer details over
                de huidige status kun je terecht in je profiel.{" "}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
         {/* NavBar onderaan fixed position */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}>
                <NavBar />
            </View>
    </SafeAreaView>
  );
}
