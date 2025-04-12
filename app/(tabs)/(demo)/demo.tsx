import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

import React, {useState} from "react";
import DogSceneAR from '../../../components/3d/sceneAR';
import { useNavigation } from '@react-navigation/native';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Demo() {
  const [isEating, setIsEating] = useState<boolean[]>([true, true, true, true]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([true, true, true, true]);
  const [isRunning, setIsRunning] = useState<boolean[]>([true, true, true, true]);
  const [isToilet, setIsToilet] = useState<boolean[]>([true, true, true, true]);
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
          height: '55%',
          backgroundColor: '#FFFDF9',
          borderColor: '#000000',
          borderWidth: 1, // Add border width
          marginBottom: 20,
        }}
      >
      <DogSceneAR />
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
        }}>
        {[0, 1, 2, 3].map((buttonIndex) => {
          const stateSetters: { state: boolean[]; setState: React.Dispatch<React.SetStateAction<boolean[]>>; label: string; altLabel: string; icon: 'bowl-food' | 'baseball' | 'person-running' | 'poop'; }[] = [
        { state: isEating, setState: setIsEating, label: 'Eten', altLabel: 'Heeft gegeten', icon: 'bowl-food' },
        { state: isPlaying, setState: setIsPlaying, label: 'Spelen', altLabel: 'Heeft gespeeld', icon: 'baseball' },
        { state: isRunning, setState: setIsRunning, label: 'Wandelen', altLabel: 'Heeft gewandeld', icon: 'person-running' },
        { state: isToilet, setState: setIsToilet, label: 'Toilet', altLabel: 'Is naar toilet gegaan', icon: 'poop' },
          ];

          const { state, setState, label, altLabel, icon } = stateSetters[buttonIndex];

          return (
        <View
          key={buttonIndex}
          style={{
            margin: 20,
            borderRadius: 20,
            overflow: 'hidden',
            width: 100,
            alignItems: 'center',
          }}
        >
          <FontAwesome6
            name={icon}
            size={24}
            color={state[buttonIndex] ? "#97B8A5" : "#183A36"}
            />
          <Button
            onPress={() => {
          setState((prevState) => {
            const newState = [...prevState];
            newState[buttonIndex] = !newState[buttonIndex];
            return newState;
          });
            }}
            title={state[buttonIndex] ? `${label}` : `${altLabel}`}
            color={state[buttonIndex] ? "#183A36" : "#97B8A5"}
          />
        </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}