import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, Text, View, ActivityIndicator, Alert, Image } from 'react-native';
import { supabase } from "../../../lib/supabase";
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomepageScreen() {
  const [firstname, setFirstname] = useState<string>(""); // State to store firstname
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for the initial session

  const [isFilled, setIsFilled] = useState<boolean>(false);  // Start with the heart being outlined
  const handleHeartClick = () => {
    const newState = !isFilled;
    setIsFilled(newState);  // Update the heart state in UI

    // In a real app, you'd update the database here
  };

  // Fetch session on mount and listen for changes to the session
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // Destructure session directly
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Listen to auth state changes (e.g., login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch firstname from Supabase when session is available
  useEffect(() => {
    if (session?.user) {
      const getFirstname = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('firstname')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;

          setFirstname(data?.firstname || "Guest");
        } catch (error: any) { // Explicitly cast the error to 'any' here
          Alert.alert("Error", error.message || "An error occurred while fetching the profile");
        }
      };

      getFirstname();
    } else {
      setFirstname("Guest");
    }
  }, [session]); // Trigger when the session changes

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFDF9',
      }}>
        <ActivityIndicator size="large" color="#183A36" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#97B8A5',
      position: 'relative',
    }}>
      <View style={{
        alignItems: 'center',
        }}>
      <Text style={{
        fontFamily: "Sirenia",
        fontWeight: "semibold",
        fontSize: 24,
        padding: 20,
        marginTop: 50,
        marginBottom: 30,
      }}>Welkom {firstname || "guest"}!</Text>
      </View>
      <View style={{ 
        position: 'absolute',
        top: 70,
        right: 30,
      }}>
        <Link href="/notifications_home">
        <FontAwesome
          name="envelope-o"
          size={30} // Icon size
          color="#183A36" // Icon color
        /></Link>
      </View>
      <ScrollView  contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        style={{
          backgroundColor: '#FFFDF9',
          borderRadius: 20,
          padding: 20,
          maxWidth: '100%',
          paddingVertical: 20,
        }}>
      <View>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "semibold",
          fontSize: 20,
          padding: 20,
          paddingRight: 40,
          marginRight: 10,
        }}>Quiz van de week</Text>
         <Text style={{
          fontFamily: "Nunito",
          fontWeight: "normal",
          fontSize: 16,
          paddingLeft: 20,
          paddingRight: 40,
          paddingBottom: 20,
        }}>
          Ben jij klaar voor een hond? Doe de test!
        </Text>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "normal",
          fontSize: 16,
          paddingLeft: 20,
          paddingRight: 40,
        }}>
          Doe nog snel de quiz van deze week, voor je informatie misloopt.
        </Text>
        <Text 
            style={{
                padding: 12,
                margin: 20,
                paddingHorizontal: 20,
                backgroundColor: '#F18B7E',
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
                color: '#FFFDF9',
            }}
            >START DE QUIZ</Text> 
      </View>

      <View>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "semibold",
          fontSize: 20,
          padding: 20,
          marginRight: 10,
        }}>Bewustzijn</Text>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "normal",
          fontSize: 16,
          paddingLeft: 20,
          paddingRight: 40,
          paddingBottom: 20,
        }}>
          Denk je eraan een hond te nemen?
        </Text>
        <View style={{ 
          alignItems: 'flex-start', 
          display: 'flex', 
          flexDirection: 'row',
          maxWidth: '100%',}}>
            <Image 
              style={{ width: 120, height: 120, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#97B8A5', marginLeft: 20 }} 
              source={{ uri: 'https://letsgokids.co.nz/wp-content/uploads/2024/03/Pet-First-Aid-Kits-3.jpg' }} 
            />
            <View>
            <Text style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              fontSize: 16,
              paddingLeft: 20,
              paddingRight: 150,
              paddingBottom: 8,
            }}>
               EHBO voor honden: wat moet je weten?
            </Text>
            <Text style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 12,
              paddingLeft: 20,
              paddingRight: 140,
            }}>
               Je hond kan gewond raken of ziek worden. Met een paar EHBO-vaardigheden ben jij de redder in nood!
            </Text>
            </View>
        </View>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "normal",
          fontSize: 14,
          paddingLeft: 20,
        }}>
          Lees eerst wat je moet weten over hondenbezit.
        </Text>
        <Text 
            style={{
                padding: 12,
                margin: 20,
                paddingHorizontal: 20,
                backgroundColor: '#FFD87E',
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
            }}
            >LEES MEER TIPS</Text> 
      </View>
      <View>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "semibold",
          fontSize: 20,
          padding: 20,
        }}>Deze honden passen bij jouw profiel:</Text>
        <View style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 4,
              backgroundColor: '#FDE4D2',
              padding: 10,
              borderRadius: 20,
              marginBottom: 10
              }}>
          <TouchableOpacity
            onPress={handleHeartClick}
            style={{ position: 'absolute', top: 20, right: 20 }}
          >
            <FontAwesome
              name={isFilled ? 'heart' : 'heart-o'}  // Conditional rendering for filled/outline heart
              size={20}
              color={isFilled ? '#183A36' : '#183A36'}  // Color for filled and outlined hearts
            />
          </TouchableOpacity>
          <Image 
              style={{ width: 120, height: 120, borderRadius: 15, marginBottom: 10, marginRight: 4 }} 
              source={require("../../../assets/images/dogfoto1.png")}
            />
            <View>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>Naam:</Text>
                <Text>Basiel</Text>
              </View>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>leeftijd:</Text>
                <Text>4 jaar</Text>
              </View>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>Ras:</Text>
                <Text>Labrador retriever</Text>
              </View>
                <View style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>Asiel:</Text>
                <Text style={{
                  paddingRight: 150,
                }}>Dierenbescherming Mechelen</Text>
                </View>
            </View>
          </View>
          <View style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 4,
              backgroundColor: '#FDE4D2',
              padding: 10,
              borderRadius: 20,
              marginVertical: 10
              }}>
            <TouchableOpacity
              onPress={handleHeartClick}
              style={{ position: 'absolute', top: 20, right: 20 }}
            >
              <FontAwesome
                name={isFilled ? 'heart' : 'heart-o'}  // Conditional rendering for filled/outline heart
                size={20}
                color={isFilled ? '#183A36' : '#183A36'}  // Color for filled and outlined hearts
              />
            </TouchableOpacity>
            <Image 
              style={{ width: 120, height: 120, borderRadius: 15, marginBottom: 10, marginRight: 4 }} 
              source={require("../../../assets/images/dogfoto2.png")}
            />
            <View>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>Naam:</Text>
                <Text>Basiel</Text>
              </View>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>leeftijd:</Text>
                <Text>4 jaar</Text>
              </View>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>Ras:</Text>
                <Text>Labrador retriever</Text>
              </View>
                <View style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row',
                gap: 4,
                }}>
                <Text style={{
                  fontWeight: "bold",
                }}>Asiel:</Text>
                <Text style={{
                  paddingRight: 150,
                }}>Dierenbescherming Mechelen</Text>
                </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

