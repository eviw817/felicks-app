import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';

export default function DogBreed() {
    const router = useRouter();
    const [dogBreed, setdogBreed] = useState<string | null>(null);

    return (
        <SafeAreaView 
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFDF9',
                position: 'relative',
            }}
        >
            <TouchableOpacity  
                style={{
                    position: "absolute",
                    top: 68,
                    left: 40,
                }}
                onPress={() => router.back()}
            >
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View
                style={{
                    top: 1,
                    flex: 1,
                    marginTop: 40,
                    justifyContent: 'flex-start',
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Nunito',
                        fontWeight: 'bold',
                        fontSize: 24,
                        padding: 20,
                        textAlign: 'center',
                    }}
                >
                    Virtuele hond
                </Text>
                <Text
                    style={{
                        fontFamily: 'Nunito',
                        fontWeight: 'normal',
                        fontSize: 16,
                        padding: 20,
                    }}>
                    Denk aan jouw favoriete hond... 
                </Text>
                <Text
                    style={{
                        fontFamily: 'Nunito',
                        fontWeight: 'normal',
                        fontSize: 16,
                        padding: 20,
                        paddingTop: 12,
                    }}
                >
                    Welk ras schiet er als eerste te binnen? Dat wordt jouw virtuele maatje!
                </Text>
                <View style={{
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#97B8A5',
                    marginBottom: 10,
                    marginHorizontal: 20,
                }}>
                    <Picker
                        selectedValue={dogBreed}
                        onValueChange={(itemValue) => setdogBreed(itemValue)}
                        style={{
                            height: 56,
                            width: '100%',
                        }}>
                        <Picker.Item label="Selecteer een optie" value="selecteer een optie" />
                        <Picker.Item label="Engelse cocker spaniël" value="engelse cocker spaniël" />
                        <Picker.Item label="Golden retriever" value="golden retriever" />
                        <Picker.Item label="Witte zwitserse herder" value="witte zwitserse herder" />
                        <Picker.Item label="Border collie" value="border collie" />
                        <Picker.Item label="Jack russel" value="jack russel" />
                    </Picker>
                </View>
                <Link
                    href="/dogName"
                    style={{
                        padding: 12,
                        margin: 20,
                        paddingHorizontal: 20,
                        backgroundColor: '#97B8A5',
                        borderRadius: 15,
                        alignItems: 'center',
                        opacity: dogBreed === "selecteer een optie" || !dogBreed ? 0.5 : 1,
                    }}
                    aria-disabled={dogBreed === "selecteer een optie" || !dogBreed}
                >
                    <Text style={{ fontWeight: 'bold', color: '#000000' }}>DOORGAAN</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}