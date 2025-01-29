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
      paddingTop: 80,
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
      }}>
        
      <ViroARSceneNavigator initialScene={{ scene: MyARSceneWrapper }} />

      <Pressable
        style={({ 
          padding: 8,
          backgroundColor: '#183A36',
          borderRadius: 7
         })}
        onPress={() => {
          console.log('Wandelen knop ingedrukt!');
        }}
      >
        <Text
        style={{          
          color: '#97B8A5',
        }}
        >Wandelen</Text>
      </Pressable>
    </View>
  );
}