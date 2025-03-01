import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';

export default function DogStart() {

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
            >Tijd om voor Cooper te zorgen!</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
            }}
            >Cooper kan niet wachten om jouw nieuwe virtuele beste vriend te worden! Ben je er klaar voor om samen een avontuur te beginnen?</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                paddingTop: 20,
                paddingLeft: 20,
            }}
            >Hoe werkt het?</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 8,
            }}
            >Via de camera op je telefoon komt Cooper tot leven in AR (Augmented Reality). Dat betekent dat je hem overal mee naartoe kunt nemen en met hem kunt spelen alsof hij écht bij je is. Hoe leuk is dat? 🎉</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingTop: 8,
            }}
            >Maar Cooper is meer dan alleen een virtuele hond. Hij is hier om jou te laten ervaren wat er allemaal komt kijken bij het verzorgen van een huisdier. Honden kunnen niet zomaar op "pauze" worden gezet. Ze hebben liefde, tijd en aandacht nodig. Spelen is belangrijk, maar er is nog zoveel meer te ontdekken!</Text>
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
            href="/dogBreed">DOORGAAN</Link>
        </View>
      </SafeAreaView>
)};