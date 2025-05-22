import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAdoptionProfile } from "../../context/AdoptionProfileContext";

type RadioButtonProps = {
  label: string;
  value: string;
  selected: string | null;
  onSelect: (value: string) => void;
};

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

type CheckboxProps = {
  label: string;
  value: string;
  selectedValues: string[];
  onSelect: (value: string) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  selectedValues,
  onSelect,
}) => (
  <TouchableOpacity
    style={styles.radioContainer}
    onPress={() => onSelect(value)}
  >
    <View
      style={[
        styles.radioCircle,
        selectedValues.includes(value) && styles.radioSelected,
      ]}
    />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

function Preference1() {
  const router = useRouter();
  const { profileData, updateProfile } = useAdoptionProfile();

  const [selectedAge, setSelectedAge] = useState<string | null>(
    profileData.preferredAge
  );
  const [preferences, setPreferences] = useState<string[]>(
    profileData.preferences
  );

  const togglePreference = (value: string) => {
    if (preferences.includes(value)) {
      setPreferences(preferences.filter((item) => item !== value));
    } else {
      setPreferences([...preferences, value]);
    }
  };

  useEffect(() => {
    updateProfile({ preferredAge: selectedAge, preferences });
  }, [selectedAge, preferences]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>
        Geef je voorkeuren op voor je ideale hond
      </Text>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Leeftijd</Text>
        {["pup", "jong_volwassen", "senior", "volwassen", "geen_voorkeur"].map(
          (age) => (
            <RadioButton
              key={age}
              label={age
                .replace("_", " ")
                .replace(/^./, (str) => str.toUpperCase())}
              value={age}
              selected={selectedAge}
              onSelect={setSelectedAge}
            />
          )
        )}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          Wat zoek je in jouw ideale hond?
        </Text>
        {[
          { label: "Kan om met kinderen", value: "kindvriendelijk" },
          { label: "Zindelijk", value: "zindelijk" },
          { label: "Kan vervoerd worden in de auto", value: "auto_vervoer" },
          { label: "Kan met andere honden", value: "sociaal_honden" },
          { label: "Kan met andere katten", value: "sociaal_katten" },
          {
            label:
              "Ervaring met andere diersoorten (bijv. kippen, konijnen, ...)",
            value: "ervaring_diersoorten",
          },
          { label: "Kan alleen thuis blijven", value: "alleen_thuis" },
          { label: "Basis commando’s gekend", value: "commando_gekend" },
          { label: "Hypoallergeen", value: "hypoallergeen" },
        ].map(({ label, value }) => (
          <Checkbox
            key={value}
            label={label}
            value={value}
            selectedValues={preferences}
            onSelect={togglePreference}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/preference_2")}
      >
        <Text style={styles.buttonText}>Volgende</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    width: "77.77%",
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

export default Preference1;
