import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// ✅ RadioButton component
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

function DailyRoutineScreen() {
  const router = useRouter();

  const [workHours, setWorkHours] = useState<string | null>(null);
  const [workFromHome, setWorkFromHome] = useState<string | null>(null);
  const [petTime, setPetTime] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Titel */}
      <Text style={styles.title}>Dagelijkse routine</Text>

      {/* Voortgangsbalk */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Formulier */}
      <View style={styles.formContainer}>
        {/* Werkuren */}
        <Text style={styles.sectionTitle}>Hoeveel uur per dag werkt u gemiddeld?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={workHours}
            onValueChange={(itemValue) => setWorkHours(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecteer een optie" value={null} />
            <Picker.Item label="Ik werk niet" value="ik werk niet" />
            <Picker.Item label="1-4 uur" value="1-4 uur" />
            <Picker.Item label="5-6 uur" value="5-6-8 uur" />
            <Picker.Item label="7-8 uur" value="7-8 uur" />
            <Picker.Item label="Meer dan 8 uur" value="8+ uur" />
          </Picker>
        </View>

        {/* Werkt u vanuit huis? */}
        <Text style={styles.sectionTitle}>Werkt u vanuit huis?</Text>
        <RadioButton label="Voltijd" value="voltijd" selected={workFromHome} onSelect={setWorkFromHome} />
        <RadioButton label="Halftijds" value="halftijds" selected={workFromHome} onSelect={setWorkFromHome} />
        <RadioButton label="Niet" value="niet" selected={workFromHome} onSelect={setWorkFromHome} />

        {/* Tijd voor huisdier */}
        <Text style={styles.sectionTitle}>Hoeveel tijd per dag kunt u besteden aan een huisdier?</Text>
        <RadioButton label="Minder dan 1 uur" value="minder1" selected={petTime} onSelect={setPetTime} />
        <RadioButton label="1 - 3 uur" value="1-3" selected={petTime} onSelect={setPetTime} />
        <RadioButton label="3+ uur" value="3+" selected={petTime} onSelect={setPetTime} />
      </View>

      {/* Volgende knop */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>VOLGENDE</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Stijlen
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
  },

  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 20,
  },

  progressFill: {
    width: '70%', // Pas aan naar de juiste waarde
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

export default DailyRoutineScreen;
