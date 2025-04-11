import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

// RadioButton component
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

function LivingSituationScreen3() {
  const router = useRouter();

  const [hasPets, setHasPets] = useState<string | null>(null);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);

  // Toggle huisdieren
  const togglePetSelection = (pet: string) => {
    if (selectedPets.includes(pet)) {
      setSelectedPets(selectedPets.filter((item) => item !== pet));
    } else {
      setSelectedPets([...selectedPets, pet]);
    }
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

      {/* Formulier */}
      <View style={styles.formContainer}>
        {/* Zijn er huisdieren? */}
        <Text style={styles.sectionTitle}>
          Zijn er andere huisdieren in huis?
        </Text>
        <RadioButton
          label="Ja"
          value="ja"
          selected={hasPets}
          onSelect={setHasPets}
        />
        <RadioButton
          label="Nee"
          value="nee"
          selected={hasPets}
          onSelect={setHasPets}
        />

        {/* Selecteer huisdieren als "Ja" is geselecteerd */}
        {hasPets === "ja" && (
          <>
            <Text style={styles.sectionTitle}>Welke huisdieren?</Text>
            {[
              "Hond",
              "Kat",
              "Reptielen",
              "Vogels",
              "Knaagdieren",
              "Vissen",
              "Kippen",
            ].map((pet) => (
              <TouchableOpacity
                key={pet}
                style={styles.radioContainer}
                onPress={() => togglePetSelection(pet)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    selectedPets.includes(pet) && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioLabel}>{pet}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      {/* Volgende knop */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./daily_routine_1")}
      >
        <Text style={styles.buttonText}>VOLGENDE</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stijlen
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
    width: "33.33%",
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
    marginTop: 20,
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

export default LivingSituationScreen3;
