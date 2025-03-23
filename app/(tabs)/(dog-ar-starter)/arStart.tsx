import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
            >Welkom Cooper</Text>
            <Image
                source={require('../../../assets/images/ARDog.png')}
                style={{
                    width: 240,
                    height: 240,
                    alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                }}
            />
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
            }}
            >Dit is jouw nieuwe hondje, Cooper. Vanaf nu ben jij verantwoordelijk voor zijn verzorging en welzijn. Zorg goed voor hem en leer stap voor stap hoe je de beste hondenvriend wordt.</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
            }}
            >Ben je er klaar voor? Laten we beginnen!</Text>
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