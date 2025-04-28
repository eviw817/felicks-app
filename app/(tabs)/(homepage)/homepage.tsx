import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, ActivityIndicator, Alert, Image } from 'react-native';
import { supabase } from "../../../lib/supabase";
import { Session } from '@supabase/supabase-js';
import { Link } from 'expo-router';

export default function Homepage() {
  const [firstname, setFirstname] = useState<string>(""); // State to store firstname
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for the initial session

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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
    }}>
      <Text style={{
        fontSize: 24,
        padding: 20,
      }}>Welkom {firstname || "guest"}!</Text>

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
        }}>
          Doe nog snel de quiz van deze week, voor je informatie misloopt.
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
            >START DE QUIZ</Text> 
      </View>

      <View
      style={{
      }}>
        <Text style={{
          fontFamily: "Nunito",
          fontWeight: "semibold",
          fontSize: 20,
          padding: 20,
          marginRight: 10,
        }}>Bewustzijn</Text>
        <View style={{ 
          alignItems: 'center', 
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
              paddingRight: 180,
            }}>
               EHBO voor honden: wat moet je weten?
            </Text>
            <Text style={{
              fontFamily: "Nunito",
              fontWeight: "normal",
              fontSize: 12,
              paddingLeft: 20,
              paddingRight: 160,
            }}>
               Je hond kan gewond raken of ziek worden. Met een paar EHBO-vaardigheden ben jij de redder in nood!
            </Text>
            </View>
        </View>
        <Text 
            style={{
                padding: 12,
                margin: 20,
                paddingHorizontal: 20,
                backgroundColor: '#97B8A5',
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
            }}
            >LEES MEER TIPS</Text> 
      </View>
    </SafeAreaView>
  );
}

