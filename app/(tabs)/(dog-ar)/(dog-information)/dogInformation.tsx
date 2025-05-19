import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';

export default function DogInformation() {

    const router = useRouter();

    return(
    <SafeAreaView 
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
      }}>
        <ScrollView
            contentContainerStyle={{
                justifyContent: "flex-start",
            }}>
        <TouchableOpacity  
            style={{
            position: "absolute",
            top: 68,
            left: 40,
            }} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black"/>
        </TouchableOpacity>
        <View
            style={{
            top: 1,
            flex: 1,
            marginTop: 40,
            justifyContent: 'flex-start',
            }}>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 20,
                padding: 20,
                paddingHorizontal: 80,
                textAlign: 'center',
            }}
            >Tijd om voor Cooper te zorgen!</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
            }}
            >Cooper staat te trappelen om jouw nieuwe virtuele beste vriend te worden!</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                paddingTop: 8,
                paddingLeft: 20,
            }}
            >Klaar om samen op avontuur te gaan?</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 0,
            }}
            >Met de camera van je telefoon komt Cooper tot leven in AR (Augmented Reality).</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 0,
            }}
            >Neem hem overal mee naartoe en speel met hem alsof hij echt bij je is. </Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                paddingTop: 8,
                paddingLeft: 20,
            }}
            >Hoe leuk is dat? </Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingBottom: 0,
            }}
            ><Text style={{fontWeight: 'bold'}}>Maar</Text> Cooper is meer dan alleen een schattige hond. Honden kunnen niet zomaar op "pauze" worden gezet. </Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 0,
            }}
            >Hij laat je zien wat er echt bij een huisdier komt kijken:</Text>
            <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 20,
            }}>
                <Text
                style={{
                    fontFamily: 'Nunito',
                    fontWeight: 'normal',
                    fontSize: 16,
                    padding: 20,
                    paddingVertical: 10,
                    marginTop: 0,
                    backgroundColor: '#FFD87E',
                    borderRadius: 10,
                }}>Liefde</Text>
                <Text
                style={{
                    fontFamily: 'Nunito',
                    fontWeight: 'normal',
                    fontSize: 16,
                    padding: 20,
                    paddingVertical: 10,
                    marginTop: 0,
                    backgroundColor: '#FFD87E',
                    borderRadius: 10,
                }}>Tijd</Text>
                <Text
                    style={{
                    fontFamily: 'Nunito',
                    fontWeight: 'normal',
                    fontSize: 16,
                    padding: 20,
                    paddingVertical: 10,
                    marginTop: 0,
                    backgroundColor: '#FFD87E',
                    borderRadius: 10,
                }}>Aandacht</Text>
            </View>
            <Text
                style={{
                    fontFamily: 'Nunito',
                    fontWeight: 'normal',
                    fontSize: 16,
                    padding: 20,
                    paddingTop: 0,
                }}
            >Spelen is pas het begin… er valt nog zoveel meer te ontdekken!</Text>
            <Link 
            style={{
                padding: 12,
                margin: 20,
                paddingHorizontal: 20,
                backgroundColor: '#97B8A5',
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
            }}
            href="/dogNotifications">DOORGAAN</Link>
        </View>
        </ScrollView>
      </SafeAreaView>
)};