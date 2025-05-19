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
            top: 66,
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
                source={require('../../../../assets/images/ARDog.png')}
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
                fontWeight: 'bold',
                fontSize: 16,
                padding: 20,
                paddingBottom: 0,
            }}
            >Dit is Cooper, jouw nieuwe hondenvriend!</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingVertical: 0,
            }}
            >Vanaf nu ben jij verantwoordelijk voor zijn zorg en geluk.</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
                paddingVertical: 0,
            }}
            >Leer stap voor stap hoe je de beste hondenbaas wordt.</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 16,
                padding: 20,
                paddingBottom: 0,
            }}
            >Klaar om te beginnen?</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 20,
                padding: 20,
                paddingTop: 0,
            }}
            >Let's go!</Text>
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
            href="/arInformation">DOORGAAN</Link>
        </View>
      </SafeAreaView>
)};