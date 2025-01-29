import { View, Text, Pressable, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import React, { useState } from "react";
import { ViroARSceneNavigator } from "@viro-community/react-viro";
import MyARScene from "../../ardog";

const MyARSceneWrapper = () => <MyARScene />;

export default function Demo() {

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={({
        flex: 1,
        justifyContent: 'center',
      })}>
        <Text style={({
          textAlign: 'center',
          paddingBottom: 10,
        })}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }


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
      style={({
        flex: 1,
        justifyContent: 'center',
        })}>
        <CameraView style={({
          flex: 1,
        })} facing={facing}>
          <ViroARSceneNavigator 
            initialScene={{ scene: MyARSceneWrapper }} 
            viroAppProps={{ videoQuality: 'High' }}
            worldAlignment="Gravity"
          />
          <View style={({
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            margin: 150,
          })}>
        <TouchableOpacity style={({
          flex: 1,
          alignSelf: 'flex-end',
          alignItems: 'center',
        })} onPress={toggleCameraFacing}>
          <Text style={({
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          })}>Flip Camera</Text>
        </TouchableOpacity>
          </View>
        </CameraView>
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