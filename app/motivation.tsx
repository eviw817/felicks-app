import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function MotivationScreen() {
  const router = useRouter();
  const [motivation, setMotivation] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Titel */}
      <Text style={styles.title}>Motivatie</Text>

      {/* Voortgangsbalk */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Motivatie veld */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Korte motivatie waarom je een hond wilt?</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder="Typ hier je motivatie …"
          value={motivation}
          onChangeText={setMotivation}
        />
      </View>

      {/* Volgende knop */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/adoption_profile_loading')}>
        <Text style={styles.buttonText}>VOLGENDE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F8F8F8',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 20,
    color: '#183A36',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'nunitoBold',
  },

  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 20,
  },

  progressFill: {
    width: '99.99%',
    height: '100%',
    backgroundColor: '#97B8A5',
    borderRadius: 3,
  },

  formContainer: {
    width: '100%',
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#183A36',
    marginBottom: 10,
    fontFamily: 'nunitoBold',
  },

  textArea: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: 'nunitoRegular',
  },

  button: {
    backgroundColor: '#97B8A5',
    paddingVertical: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#183A36',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'nunitoBold',
  },
});

export default MotivationScreen;
