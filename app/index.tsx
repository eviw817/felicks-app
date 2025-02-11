import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container} className="bg-baby-powder">
    <Image
      source={require('../assets/images/logo_felicks.png')} 
      style={styles.logo}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 340,
    height: 340,
    resizeMode: 'contain',
  },
});

