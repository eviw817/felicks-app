import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity  
            style={{
            position: "absolute",
            top: 98,
            left: 16,
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
            >Karakter:</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 8,
            }}
            >De Labrador Retriever is een vriendelijke, zachtaardige en actieve hond met een aanhankelijk en gevoelig karakter. Hij is intelligent, betrouwbaar. Labradors zijn sociaal en extravert, waardoor ze goed overweg kunnen met kinderen en andere dieren. Ze zijn speels, liefdevol en werken graag samen, maar kunnen soms een tikje eigenwijs zijn.</Text>
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
               Labradors hebben een grote eetlust en kunnen snel te zwaar worden. Maaltijden afwegen en traktaties beperken is belangrijk.
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
                 paddingRight: 8,
               }}
             >
               Ze hebben minstens 30-60 minuten lichaamsbeweging per dag nodig om hun energie kwijt te kunnen.
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
                 paddingRight: 8,
               }}
             >
               Labradors zijn nieuwsgierig en kunnen vuilnis doorzoeken of oneetbare dingen opeten.
             </Text>
           </View>
   
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 8,
            }}
            >De Labrador Retriever is een liefdevolle en veelzijdige gezinshond, perfect voor actieve baasjes die tijd willen investeren in beweging, training en samenzijn. Met de juiste opvoeding is hij een loyale en vrolijke metgezel.</Text>
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
      </SafeAreaView>
)};