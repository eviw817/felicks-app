import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// RadioButton
type RadioButtonProps = {
  label: string;
  value: string;
  selected: string | null;
  onSelect: (value: string) => void;
};

// RadioButton component
const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  selected,
  onSelect,
}) => (
  <TouchableOpacity
    style={styles.radioContainer}
    onPress={() => onSelect(value)}
  >
    <View
      style={[styles.radioCircle, selected === value && styles.radioSelected]}
    />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

function LivingSituationScreen2() {
  const router = useRouter();

  // State correct getypeerd
  const [livingSituation, setLivingSituation] = useState<string | null>(null);
  const [childrenInHouse, setChildrenInHouse] = useState<string | null>(null);
  const [birthDates, setBirthDates] = useState<Date[]>([]);
  const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

  // Leeftijd berekenen op basis van geboortedatum
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  // Geboortedatum toevoegen
  const addBirthDateField = () => {
    if (birthDates.length < 5) {
      setBirthDates([...birthDates, new Date()]); // Standaard huidige datum
    }
  };

  // Geboortedatum bijwerken
  const updateBirthDate = (
    index: number,
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      const updatedDates = [...birthDates];
      updatedDates[index] = selectedDate;
      setBirthDates(updatedDates);
    }
    setShowPickerIndex(null);
  };

  // Geboortedatum verwijderen
  const removeBirthDate = (index: number) => {
    const updatedDates = birthDates.filter((_, i) => i !== index);
    setBirthDates(updatedDates);
  };

  return (
    <View style={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      {/* Titel */}
      <Text style={styles.title}>Woonsituatie</Text>

      {/* Voortgangsbalk */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Vragenformulier */}
      <View style={styles.formContainer}>
        {/* Woon situatie vraag */}
        <Text style={styles.sectionTitle}>
          Hoe ziet je woonsituatie er uit?
        </Text>
        <RadioButton
          label="Ik woon alleen"
          value="alleen"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />
        <RadioButton
          label="Ik woon samen met mijn partner"
          value="partner"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />
        <RadioButton
          label="Ik woon samen met mijn gezin/kinderen"
          value="gezin"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />
        <RadioButton
          label="Ik woon in een gedeeld huis (bijv. huisgenoten)"
          value="gedeeld"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />

        {/* Kinderen in huis vraag */}
        <Text style={styles.sectionTitle}>Zijn er kinderen in huis?</Text>
        <RadioButton
          label="Ja"
          value="ja"
          selected={childrenInHouse}
          onSelect={setChildrenInHouse}
        />
        <RadioButton
          label="Nee"
          value="nee"
          selected={childrenInHouse}
          onSelect={setChildrenInHouse}
        />

        {/* Kinderen leeftijden sectie als 'Ja' is geselecteerd */}
        {childrenInHouse === "ja" && (
          <>
            <Text style={styles.sectionTitle}>Vul de geboortedatum in</Text>

            {/* Geboortedata invoeren */}
            <View style={styles.ageInputContainer}>
              {birthDates.map((date, index) => (
                <View key={index} style={styles.birthDateRow}>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowPickerIndex(index)}
                  >
                    <Text style={styles.datePickerText}>
                      {new Intl.DateTimeFormat("nl-NL", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(date)}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.ageText}>{calculateAge(date)} jaar</Text>
                  <TouchableOpacity onPress={() => removeBirthDate(index)}>
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color="red"
                    />
                  </TouchableOpacity>

                  {/* Date Picker Popup */}
                  {showPickerIndex === index && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) =>
                        updateBirthDate(index, event, selectedDate)
                      }
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Knop om een extra geboortedatum toe te voegen */}
            {birthDates.length < 5 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={addBirthDateField}
              >
                <Ionicons name="add-circle-outline" size={30} color="#183A36" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Volgende knop */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../living_situation_3")}
      >
        <Text style={styles.buttonText}>volgende</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#F8F8F8",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 20,
    color: "#183A36",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "nunitoBold",
  },

  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginBottom: 20,
  },

  progressFill: {
    width: "22.22%",
    height: "100%",
    backgroundColor: "#97B8A5",
    borderRadius: 3,
  },

  formContainer: {
    width: "100%",
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 10,
    fontFamily: "nunitoBold",
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#97B8A5",
    marginRight: 10,
  },

  radioSelected: {
    backgroundColor: "#97B8A5",
  },

  radioLabel: {
    fontSize: 16,
    color: "#183A36",
    fontFamily: "nunitoRegular",
  },

  ageInputContainer: {
    width: "100%",
    marginBottom: 10,
  },

  birthDateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  datePickerButton: {
    backgroundColor: "#97B8A5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  datePickerText: {
    color: "#183A36",
    fontSize: 16,
  },

  ageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#183A36",
  },

  addButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#183A36",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "nunitoBold",
  },
});

export default LivingSituationScreen2;
