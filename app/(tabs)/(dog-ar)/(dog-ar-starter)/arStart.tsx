import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams  } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import { supabase } from '../../../../lib/supabase'; // adjust if your path is different

export default function DogInformation() {

    const router = useRouter();

    const { petId } = useLocalSearchParams();

    const [dogName, setDogName] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [fetchError, setFetchError] = React.useState("");

    React.useEffect(() => {
        console.log('DogInformation petId:', petId);  // <-- Debug: log petId here

        if (petId && typeof petId === "string" && petId.length > 0) {
        const fetchDogName = async () => {
            setLoading(true);
            setFetchError("");

            const { data, error } = await supabase
            .from("ar_dog")
            .select("name")
            .eq("id", petId)
            .single();

            console.log("Supabase fetch result:", { data, error }); // <-- Debug: log result

            if (error) {
            console.log("Error fetching dog name:", error.message);
            setFetchError(error.message);
            setDogName("");
            } else {
            setDogName(data?.name || "");
            }

            setLoading(false);
        };

        fetchDogName();
        } else {
        // If petId is invalid or missing
        setLoading(false);
        setFetchError("Ongeldig of ontbrekend petId.");
        }
    }, [petId]);

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
            >Welkom {dogName || "nog geen naam"}</Text>
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
            >Dit is {dogName || "nog geen naam"}, jouw nieuwe hondenvriend!</Text>
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
            href={`/arInformation?petId=${petId}`}>DOORGAAN</Link>
        </View>
      </SafeAreaView>
)};