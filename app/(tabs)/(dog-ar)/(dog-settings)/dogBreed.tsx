import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';

type RadioButtonProps = {
    label: string;
    value: string;
    selected: string | null;
    onSelect: (value: string) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, selected, onSelect }) => (
    <TouchableOpacity
        style={{
            flexDirection: 'row',
            paddingLeft: 20,
            paddingVertical: 10,
        }}
        onPress={() => onSelect(value)}
    >
      <View
        style={[
          {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
          {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#97B8A5',
            marginRight: 10,
          },
          selected === value && { backgroundColor: '#97B8A5' },
        ]}
      />
      <Text
        style={{
          fontSize: 16,
          color: '#183A36',
          fontFamily: 'nunitoRegular',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
);

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
                    top: 106,
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
                    }}
                >
                    Je gaf aan tijdens het invullen van het formulier dat je graag een labrador wilt.
                </Text>
                <Text
                    style={{
                        fontFamily: 'Nunito',
                        fontWeight: 'bold',
                        fontSize: 18,
                        padding: 20,
                        paddingTop: 16,
                    }}
                >
                    Wil je nog steeds voor een labrador gaan als virtuele hond?
                </Text>
                <RadioButton label="Ja" value="ja" selected={dogBreed} onSelect={setdogBreed} />
                <RadioButton label="Nee" value="nee" selected={dogBreed} onSelect={setdogBreed} />
                <TouchableOpacity
                    disabled={!dogBreed}
                    onPress={() => {
                        if (dogBreed === 'ja') {
                            router.push('/dogName');
                        } else if (dogBreed === 'nee') {
                            router.push('/dogBreedChoice');
                        }
                    }}
                    style={{
                        opacity: dogBreed ? 1 : 0.5,
                        padding: 12,
                        margin: 20,
                        paddingHorizontal: 20,
                        backgroundColor: '#97B8A5',
                        borderRadius: 15,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontWeight: 'bold', color: '#000000' }}>DOORGAAN</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}