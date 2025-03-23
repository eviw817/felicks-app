import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Typing for RadioButton Props
interface RadioButtonProps {
  label: string;
  value: string;
  selected: string | null;
  onSelect: (value: string) => void;
}

// RadioButton component
const RadioButton: React.FC<RadioButtonProps> = ({ label, value, selected, onSelect }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={() => onSelect(value)}>
    <View style={[styles.radioCircle, selected === value && styles.radioSelected]} />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

function Preference2() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Titel */}
      <Text style={styles.title}>Geef je voorkeuren op voor je ideale hond</Text>

      {/* Voortgangsbalk */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Grootte van het dier */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Grootte van het dier</Text>
        <RadioButton label="Klein (<10kg)" value="klein" selected={selectedSize} onSelect={setSelectedSize} />
        <RadioButton label="Middelgroot (10-25kg)" value="middelgroot" selected={selectedSize} onSelect={setSelectedSize} />
        <RadioButton label="Groot (>25kg)" value="groot" selected={selectedSize} onSelect={setSelectedSize} />
        <RadioButton label="Geen voorkeur" value="geen_voorkeur" selected={selectedSize} onSelect={setSelectedSize} />
      </View>

      {/* Activiteitsniveau */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Activiteitsniveau</Text>
        <RadioButton label="Laag" value="laag" selected={selectedActivity} onSelect={setSelectedActivity} />
        <RadioButton label="Gemiddeld" value="gemiddeld" selected={selectedActivity} onSelect={setSelectedActivity} />
        <RadioButton label="Hoog" value="hoog" selected={selectedActivity} onSelect={setSelectedActivity} />
      </View>

      {/* Specifieke rasvoorkeuren */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Specifieke rasvoorkeuren?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedBreed}
            onValueChange={(itemValue) => setSelectedBreed(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecteer een optie" value={null} />
            <Picker.Item label="Labrador" value="labrador" />
            <Picker.Item label="Golden Retriever" value="golden_retriever" />
            <Picker.Item label="Bulldog" value="bulldog" />
            <Picker.Item label="Duitse Herder" value="duitse_herder" />
            <Picker.Item label="Geen voorkeur" value="geen_voorkeur" />
          </Picker>
        </View>
      </View>

      {/* Volgende knop */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/motivation')}> 
        <Text style={styles.buttonText}>Volgende</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 20,
  },

  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 20,
  },

  progressFill: {
    width: '88.88%',
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

  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#97B8A5',
    marginBottom: 10,
  },

  picker: {
    height: 50,
    width: '100%',
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#97B8A5',
    marginRight: 10,
  },

  radioSelected: {
    backgroundColor: '#97B8A5',
  },

  radioLabel: {
    fontSize: 16,
    color: '#183A36',
    fontFamily: 'nunitoRegular',
  },

  button: {
    backgroundColor: '#97B8A5',
    paddingVertical: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
export default Preference2;
