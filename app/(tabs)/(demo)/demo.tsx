import { View, Text, Pressable } from 'react-native';

import React from "react";
import { ViroARSceneNavigator } from "@viro-community/react-viro";
import MyARScene from "../../ardog";

const MyARSceneWrapper = () => <MyARScene />;

export default function Demo() {
  return (
    <View 
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
        height: 400,
        backgroundColor: '#FFFDF9',
        }}>
        <ViroARSceneNavigator 
        initialScene={{ scene: MyARSceneWrapper }} 
        viroAppProps={{ videoQuality: 'high' }}
        worldAlignment="Gravity"
        />
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
    </View>
  );
}