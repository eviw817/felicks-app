import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// RadioButton component
type RadioButtonProps = {
  label: string;
  value: string;
  selected: string | null;
  onSelect: (value: string) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, selected, onSelect }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={() => onSelect(value)}>
    <View style={[styles.radioCircle, selected === value && styles.radioSelected]} />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

// Checkbox component
type CheckboxProps = {
  label: string;
  value: string;
  selectedValues: string[];
  onSelect: (value: string) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, value, selectedValues, onSelect }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={() => onSelect(value)}>
    <View style={[styles.radioCircle, selectedValues.includes(value) && styles.radioSelected]} />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

function PetExperienceScreen() {
  const router = useRouter();
  const [experience, setExperience] = useState<string | null>(null);
  const [petsOwned, setPetsOwned] = useState<string[]>([]);

  // Functie om huisdieropties te selecteren of te deselecteren
  const togglePetSelection = (value: string) => {
    if (petsOwned.includes(value)) {
      setPetsOwned(petsOwned.filter((item) => item !== value));
    } else {
      setPetsOwned([...petsOwned, value]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Titel */}
      <Text style={styles.title}>Ervaring met huisdieren</Text>

      {/* Voortgangsbalk */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Ervaring met huisdieren */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Heb je eerder voor huisdieren gezorgd?</Text>
        <RadioButton label="Ik heb geen ervaring" value="geen" selected={experience} onSelect={setExperience} />
        <RadioButton label="Ik heb een hond gehad" value="hond" selected={experience} onSelect={setExperience} />
        <RadioButton label="Ik heb voor een ander huisdier gezorgd" value="meerdere" selected={experience} onSelect={setExperience} />

        {/* Alleen tonen als 'Ik heb verschillende huisdieren gehad' is geselecteerd */}
        {experience === 'meerdere' && (
          <>
            <Text style={styles.sectionTitle}>Voor welk dier heb je gezorgd</Text>
            <Checkbox label="Kat" value="kat" selectedValues={petsOwned} onSelect={togglePetSelection} />
            <Checkbox label="Reptielen" value="reptielen" selectedValues={petsOwned} onSelect={togglePetSelection} />
            <Checkbox label="Vogels" value="vogels" selectedValues={petsOwned} onSelect={togglePetSelection} />
            <Checkbox label="Knaagdieren" value="knaagdieren" selectedValues={petsOwned} onSelect={togglePetSelection} />
            <Checkbox label="Vissen" value="vissen" selectedValues={petsOwned} onSelect={togglePetSelection} />
            <Checkbox label="Kippen" value="kippen" selectedValues={petsOwned} onSelect={togglePetSelection} />
          </>
        )}
      </View>

      {/* Volgende knop */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Volgende</Text>
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
    width: '80%', // Pas aan naar juiste waarde
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

export default PetExperienceScreen;
