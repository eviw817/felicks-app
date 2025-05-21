import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../lib/supabase'; // adjust if your path is different

export default function DogName() {
    const router = useRouter();
    const { petId } = useLocalSearchParams();
    const [text, onChangeText] = React.useState('');
    const [dogBreed, setDogBreed] = React.useState<string>("");
    const [dogName, setDogName] = React.useState<string>("");

    React.useEffect(() => {
      if (petId && typeof petId === 'string' && petId.length > 0) {
        const fetchDogData = async () => {
          const { data, error } = await supabase
            .from('ar_dog')
            .select('breed, name')
            .eq('id', petId)
            .single();

          if (error) {
            console.log("Error fetching dog data:", error.message);
            return;
          }

          setDogBreed(data?.breed || "");
          setDogName(data?.name || "");
          onChangeText(data?.name || ""); // also fill the input with existing name
        };

        fetchDogData();
      }
    }, [petId]);

    const handleContinuePress = async () => {
      if (!text.trim()) return;

      console.log('Entered name:', text);
      console.log('Updating pet with ID:', petId);

      if (!petId || typeof petId !== 'string') {
        Alert.alert('Fout', 'Pet ID ontbreekt of is ongeldig.');
        return;
      }

      const { error } = await supabase
        .from('ar_dog')
        .update({ name: text.trim() })
        .eq('id', petId);

      if (error) {
        console.log('Update error:', error.message);
        Alert.alert('Fout', 'Naam kon niet opgeslagen worden.');
        return;
      }

      console.log('Name update successful!');
      setDogName(text.trim());

      // ✅ Correct dynamic navigation:
      router.push(`/dogInformation?petId=${petId}`);
    };


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
        <AntDesign name="arrowleft" size={24} color="black"/>
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
            fontWeight: 'bold',
            fontSize: 16,
            padding: 20,
          }}
        >
          Gefeliciteerd!
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
          Je hebt net een {dogBreed || "hond"} toegevoegd aan je gezin. Tijd voor een naam!
        </Text>
        <Text
          style={{
            fontFamily: 'Nunito',
            fontWeight: 'bold',
            fontSize: 16,
            padding: 20,
            paddingTop: 16,
            paddingBottom: 0,
          }}
        >
          Naam
        </Text>
        <View style={{
          margin: 20,
          marginTop: 8,
          backgroundColor:'#D9D9D9',
          borderRadius: 10,
        }}>
          <TextInput
            style={{
              height: 20,
              margin: 12,
              borderRadius: 10, 
            }}
            placeholderTextColor="#879593"
            onChangeText={onChangeText}
            value={text}
            placeholder="Geef je viervoeter een naam"
          />
        </View>
        <TouchableOpacity
          onPress={handleContinuePress}
          disabled={text.trim().length === 0}
          style={{
            opacity: text.trim().length > 0 ? 1 : 0.5,
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