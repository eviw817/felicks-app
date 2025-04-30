import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useAdoptionProfile } from "../../context/AdoptionProfileContext";

const RadioButton = ({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: string;
  selected: string | null;
  onSelect: (value: string) => void;
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
  const { updateProfile } = useAdoptionProfile();

  const [livingSituation, setLivingSituation] = useState<string | null>(null);
  const [hasChildren, setHasChildren] = useState<string | null>(null);
  const [birthDates, setBirthDates] = useState<Date[]>([]);
  const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const addBirthDateField = () => {
    if (birthDates.length < 5) {
      setBirthDates([...birthDates, new Date()]);
    }
  };

  const updateBirthDate = (
    index: number,
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      const updated = [...birthDates];
      updated[index] = selectedDate;
      setBirthDates(updated);
    }
    setShowPickerIndex(null);
  };

  const removeBirthDate = (index: number) => {
    const updated = birthDates.filter((_, i) => i !== index);
    setBirthDates(updated);
  };

  const handleNext = () => {
    const childrenAges = birthDates.map((date) => calculateAge(date));
    updateProfile({
      livingSituation,
      hasChildren,
      childrenAges,
    });
    router.push("/living_situation_3");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Woonsituatie</Text>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.formContainer}>
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
          label="Ik woon met partner"
          value="partner"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />
        <RadioButton
          label="Ik woon met gezin/kinderen"
          value="gezin"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />
        <RadioButton
          label="Ik woon in gedeeld huis"
          value="gedeeld"
          selected={livingSituation}
          onSelect={setLivingSituation}
        />

        <Text style={styles.sectionTitle}>Zijn er kinderen in huis?</Text>
        <RadioButton
          label="Ja"
          value="ja"
          selected={hasChildren}
          onSelect={setHasChildren}
        />
        <RadioButton
          label="Nee"
          value="nee"
          selected={hasChildren}
          onSelect={setHasChildren}
        />

        {hasChildren === "ja" && (
          <>
            <Text style={styles.sectionTitle}>Vul de geboortedatum in</Text>
            {birthDates.map((date, index) => (
              <View key={index} style={styles.birthDateRow}>
                <TouchableOpacity onPress={() => setShowPickerIndex(index)}>
                  <Text style={styles.datePickerText}>
                    {date.toLocaleDateString("nl-NL")}
                  </Text>
                </TouchableOpacity>
                <Text>{calculateAge(date)} jaar</Text>
                <TouchableOpacity onPress={() => removeBirthDate(index)}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
                {showPickerIndex === index && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={(event, selectedDate) =>
                      updateBirthDate(index, event, selectedDate)
                    }
                  />
                )}
              </View>
            ))}
            {birthDates.length < 5 && (
              <TouchableOpacity onPress={addBirthDateField}>
                <Ionicons name="add-circle-outline" size={30} color="#183A36" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>volgende</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#F8F8F8",
  },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
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
  formContainer: { width: "100%", marginBottom: 30 },
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
  radioSelected: { backgroundColor: "#97B8A5" },
  radioLabel: { fontSize: 16, color: "#183A36", fontFamily: "nunitoRegular" },
  birthDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerText: { fontSize: 16, color: "#183A36", marginRight: 10 },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#183A36",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "nunitoBold",
  },
});

export default LivingSituationScreen2;
