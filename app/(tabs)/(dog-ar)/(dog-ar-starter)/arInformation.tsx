import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
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
          paddingVertical: 40,
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity  
            style={{
            position: "absolute",
            top: 68,
            left: 20,
            }} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black"/>
        </TouchableOpacity>
        <View
            style={{
            top: 1,
            flex: 1,
            marginTop: 4,
            justifyContent: 'flex-start',
            }}>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 20,
                padding: 20,
                textAlign: 'center',
            }}
            >Cooper</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                paddingTop: 20,
                paddingLeft: 20,
            }}
            >Jouw labrador in een notendop:</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                paddingTop: 0,
                paddingLeft: 20,
            }}
            >Karakter</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 8,
                paddingRight: 30,
                
            }}
            >Labradors zijn vriendelijk, zachtaardig en dol op gezelschap. Ze zijn slim, sociaal en werken graag samen, perfect voor gezinnen met kinderen en andere dieren. Soms een tikkeltje eigenwijs, maar altijd liefdevol en enthousiast!</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                paddingTop: 0,
                paddingLeft: 20,
            }}
            >Aandachtspunten:</Text>
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
                 lineHeight: 36,
               }}
             >
               •
             </Text>
             <Text
               style={{
                 fontFamily: "Nunito",
                 fontWeight: "normal",
                 fontSize: 16,
                 paddingRight: 40,
                 lineHeight: 28,
               }}
             >
               Ze houden van eten… misschien iets té veel. Let op hun gewicht!
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
                 lineHeight: 36,
               }}
             >
               •
             </Text>
             <Text
               style={{
                 fontFamily: "Nunito",
                 fontWeight: "normal",
                 fontSize: 16,
                 paddingRight: 20,
                 lineHeight: 28,
               }}
             >
               Bewegen is een must: minstens 30–60 minuten per dag.
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
                 lineHeight: 36,
               }}
             >
               •
             </Text>
             <Text
               style={{
                 fontFamily: "Nunito",
                 fontWeight: "normal",
                 fontSize: 16,
                 paddingRight: 40,
                 lineHeight: 28,
               }}
             >
               Nieuwsgierig als ze zijn, snuffelen ze graag, zelfs in de vuilnisbak.
             </Text>
           </View>
   
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingRight: 30,
            }}
            >Een labrador is de ideale gezinshond voor actieve baasjes die houden van wandelen, trainen en samen plezier maken. Geef je hem de juiste aandacht, dan heb je er een vrolijke vriend voor het leven aan!</Text>
            <Link 
            style={{
                padding: 12,
                margin: 20,
                paddingHorizontal: 20,
                marginRight: 46,
                backgroundColor: '#97B8A5',
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
            }}
            href="/demo">DOORGAAN</Link>
        </View>
        </ScrollView>
      </SafeAreaView>
)};