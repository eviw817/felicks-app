import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

import React, {useState} from "react";
import DogSceneAR from '../../../components/3d/sceneAR';
import { useNavigation } from '@react-navigation/native';

export default function Demo() {
  const [isRunning, setIsRunning] = useState(true);
  const navigation = useNavigation();

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
          marginBottom: 20,
        }}
      >
      <DogSceneAR />
      </View>

      <Button
        // style={{
        //   margin: 20,
        //   padding: 16,
        //   backgroundColor: '#183A36',
        //   borderRadius: 7,
        //   color: '#97B8A5',
        //   fontSize: 20,
        // }}
        onPress={() => {
          setIsRunning(false);
        }}
        disabled={!isRunning}
        title={isRunning ? 'Wandelen' : 'Ik ga wandelen!'}
      >
      </Button>
    </SafeAreaView>
  );
}