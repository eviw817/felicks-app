import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.container}>
      {/* Titel */}
      <Text style={styles.title}>Adoptieprofiel</Text>

      {/* Spinner */}
      <ActivityIndicator size="large" color="#183A36" style={styles.spinner} />

      {/* Wachttekst */}
      <Text style={styles.loadingText}>Even geduld…{'\n'}We zoeken jouw perfecte match!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 20,
    color: '#183A36',
    fontFamily: 'nunitoBold',
    position: 'absolute',
    top: 60,
  },

  spinner: {
    marginBottom: 20,
  },

  loadingText: {
    fontSize: 16,
    color: '#183A36',
    textAlign: 'center',
    fontFamily: 'nunitoRegular',
  },
});

export default LoadingScreen;
