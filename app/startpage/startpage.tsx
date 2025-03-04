import React, { useEffect } from 'react';
import { useRouter } from "expo-router"; 
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
    
      <Text style={styles.title} className='semibold'>Welkom bij Felicks!</Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFDF9',
  },
 
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183A36',
    marginBottom: 10,
  },
  
});

export default StartScreen;
