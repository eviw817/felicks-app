import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, Text, View, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { supabase } from "../../../lib/supabase";
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router'; 
import { Link } from 'expo-router';

export default function Notifications() {

    const router = useRouter();

  return (
    <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFDF9',
    }}>
        <ScrollView  contentContainerStyle={{ flexGrow: 1 }} >
            <TouchableOpacity  
                style={{
                position: "absolute",
                top: 98,
                left: 16,
                maxWidth: '100%',
                }} onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="black"/>
            </TouchableOpacity>
            <View style={{
                alignItems: 'center',
                }}>
                <Text style={{
                    fontFamily: "Sirenia",
                    fontWeight: "semibold",
                    fontSize: 24,
                    padding: 20,
                    marginTop: 70,
                }}>Meldingen</Text>
            </View>
            <View style={{
                alignItems: 'flex-start',
                marginLeft:20,
                marginRight:20,
                }}>
                <Text style={{
                    fontFamily: "Nunito",
                    fontWeight: "semibold",
                    fontSize: 20,
                    padding: 10,
                }}>Recente meldingen</Text>
                <Text style={{
                    fontFamily: "Nunito",
                    fontWeight: "semibold",
                    fontSize: 16,
                    padding: 10,
                    color: 'rgba(24, 58, 54, 0.5)',
                }}>Geen meldingen</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

