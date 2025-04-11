import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

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

function DailyRoutineScreen_2() {
  const router = useRouter();
  const [timeWithDog, setTimeWithDog] = useState<string | null>(null);
  const [weekendRoutine, setWeekendRoutine] = useState<string | null>(null);

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

      {/* Tijdsbesteding aan hond */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Hoeveel tijd wil je dagelijks besteden aan je hond?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={timeWithDog}
            onValueChange={(itemValue) => setTimeWithDog(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecteer een optie" value={null} />
            <Picker.Item label="0-30 min" value="0-30 min" />
            <Picker.Item label="30-60 min" value="30-60 min" />
            <Picker.Item label="1-1,5 uur" value="1-1,5 uur" />
            <Picker.Item label="1,5-2 uur" value="1,5-2 uur" />
            <Picker.Item label="Meer dan 2 uur" value="2+" />
          </Picker>
        </View>

        {/* Weekendroutine vraag */}
        <Text style={styles.sectionTitle}>Wat is je weekendroutine?</Text>
        <RadioButton label="Ik ben vaak buiten actief" value="buiten-actief" selected={weekendRoutine} onSelect={setWeekendRoutine} />
        <RadioButton label="Ik blijf meestal thuis" value="thuis" selected={weekendRoutine} onSelect={setWeekendRoutine} />
        <RadioButton label="Ik werk in het weekend" value="werk-in-weekend" selected={weekendRoutine} onSelect={setWeekendRoutine} />
        <RadioButton label="Mijn weekend wisselt steeds" value="wisselt" selected={weekendRoutine} onSelect={setWeekendRoutine} />
      </View>

      {/* Volgende knop */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/experience')}>
        <Text style={styles.buttonText}>Volgende</Text>
      </TouchableOpacity>
    </View>
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
  },

  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 20,
  },

  progressFill: {
    width: '55.55%', 
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

export default DailyRoutineScreen_2;
