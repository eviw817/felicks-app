import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router'; 
import AntDesign from '@expo/vector-icons/AntDesign';

export default function DogName() {
  const router = useRouter();
  const [text, onChangeText] = React.useState('');

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
            fontWeight: 'normal',
            fontSize: 16,
            padding: 20,
          }}
        >
          Gefeliciteerd! Je gezin is net een pootje groter geworden!
        </Text>
        <Text
          style={{
            fontFamily: 'Nunito',
            fontWeight: 'normal',
            fontSize: 16,
            padding: 20,
            paddingTop: 16,
          }}
        >
          Je hebt een labrador gekozen. Nu is het tijd om jouw nieuwe maatje een naam te geven.
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
          onPress={() => {
            if (text.trim().length > 0) {
              router.push('/dogInformation');
            }
          }}
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