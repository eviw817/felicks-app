import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const dogs = [
  { id: 'appenzeller', name: 'Appenzeller Sennenhond', image: require('../assets/images/appenzeller.png') },
  { id: 'cocker', name: 'Engelse cocker spaniel', image: require('../assets/images/cocker.png') },
  { id: 'jack', name: 'Jack russell terriër', image: require('../assets/images/jack.png') },
  { id: 'border', name: 'Border collie', image: require('../assets/images/collie.png') },
];

function SuitableDogsScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Geschikte honden</Text>
      <Text style={styles.subtitle}>
        Dit zijn enkele honden die passen bij je profiel. Klik op een hond voor meer info.
      </Text>

      <View style={styles.dogGrid}>
        {dogs.map((dog) => (
          <TouchableOpacity
            key={dog.id}
            style={styles.dogItem}
            onPress={() => router.push({ pathname: '/dog_info', params: { id: dog.id } })}
          >
            <Image source={dog.image} style={styles.image} />
            <Text style={styles.name}>{dog.name}</Text>
          </TouchableOpacity>
        ))}
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
    padding: 20,
    backgroundColor: '#FDFCF9',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#183A36',
    fontFamily: 'nunitoBold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#183A36',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'nunitoRegular',
  },
  dogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  dogItem: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 8,
    fontSize: 14,
    color: '#183A36',
    textAlign: 'center',
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

export default SuitableDogsScreen;
