import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable } from 'react-native';

import React from "react";
import DogSceneAR from '../../../components/3d/sceneAR';

export default function Demo() {
  return (
    <SafeAreaView 
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
      }}>

      <Text
      style={{
        fontSize: 24,
        padding: 20,
      }}
      >Cooper</Text>

      <View
        style={{  
          width: '80%',
          height: '70%',
          backgroundColor: '#FFFDF9',
          borderColor: '#000000',
          borderWidth: 1, // Add border width
        }}
      >
      <DogSceneAR />
      </View>

      <Pressable
        style={({ 
          margin: 20,
          padding: 16,
          backgroundColor: '#183A36',
          borderRadius: 7,
          
         })}
        onPress={() => {
          console.log('Wandelen knop ingedrukt!');
        }}
      >
        <Text
        style={{          
          color: '#97B8A5',
          fontSize: 20,
        }}
        >Wandelen</Text>
      </Pressable>
    </SafeAreaView>
  );
}