import { BeagleScene } from "@/components/augumented-dog/scenes/BeagleScene";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { SafeAreaView, View, Button, TouchableOpacity } from "react-native";
import { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const AugumentedDog = () => {
  const [isEating, setIsEating] = useState<boolean[]>([true, true, true, true]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([true, true, true, true]);
  const [isRunning, setIsRunning] = useState<boolean[]>([true, true, true, true]);
  const [isToilet, setIsToilet] = useState<boolean[]>([true, true, true, true]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexGrow: 1,
      }}
    >
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <BeagleScene />,
        }}
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      >
        <BeagleScene
          style={{
            width: "100%",
            height: 1000,
          }}
        />
      </ViroARSceneNavigator>
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          alignSelf: 'center',
        }}>
        {[0, 1, 2, 3].map((buttonIndex) => {
          const stateSetters: { state: boolean[]; setState: React.Dispatch<React.SetStateAction<boolean[]>>; icon: 'bowl-food' | 'baseball' | 'person-running' | 'poop'; }[] = [
        { state: isEating, setState: setIsEating, icon: 'bowl-food' },
        { state: isPlaying, setState: setIsPlaying, icon: 'baseball' },
        { state: isRunning, setState: setIsRunning, icon: 'person-running' },
        { state: isToilet, setState: setIsToilet, icon: 'poop' },
          ];

          const { state, setState, icon } = stateSetters[buttonIndex];

          return (
        <TouchableOpacity
          key={buttonIndex}
          activeOpacity={0.7}
          onPress={() => {
            setState((prevState) => {
              const newState = [...prevState];
              newState[buttonIndex] = !newState[buttonIndex];
              return newState;
            });
          }}
          style={{
            marginHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: state[buttonIndex]
              ? "rgba(253, 228, 210, 1)"
              : "rgba(253, 228, 210, 0.5)",
          }}
          accessibilityLabel={icon}
        >
          <FontAwesome6
            name={icon}
            size={28}
            color={state[buttonIndex] ? "#183A36" : "#183A36"}
          />
        </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default AugumentedDog;
