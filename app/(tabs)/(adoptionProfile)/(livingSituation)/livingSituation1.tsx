// app/adoptionprofile/living_situation_1.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useAdoptionProfile } from "../../../../context/AdoptionProfileContext";

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

function LivingSituationScreen1() {
  const [fontsLoaded] = useFonts({
    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),
  });

  const router = useRouter();
  const { updateProfile, profileData } = useAdoptionProfile();

  const [woningType, setWoningType] = useState<string | null>(
    profileData.housingType
  );
  const [tuin, setTuin] = useState<string | null>(profileData.garden);
  const [omgeving, setOmgeving] = useState<string | null>(
    profileData.environment
  );

  const handleNext = () => {
    updateProfile({
      housingType: woningType,
      garden: tuin,
      environment: omgeving,
    });
    router.push("/livingSituation2");
  };

  return (
    <View style={styles.container} className="bg-baby-powder">
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#183A36" />
      </TouchableOpacity>

      <Text style={styles.title}>Woonsituatie</Text>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Woningtype</Text>
        <RadioButton
          label="Appartement"
          value="appartement"
          selected={woningType}
          onSelect={setWoningType}
        />
        <RadioButton
          label="Huis"
          value="huis"
          selected={woningType}
          onSelect={setWoningType}
        />
        <RadioButton
          label="Boot"
          value="boot"
          selected={woningType}
          onSelect={setWoningType}
        />
        <RadioButton
          label="Andere"
          value="andere"
          selected={woningType}
          onSelect={setWoningType}
        />

        <Text style={styles.sectionTitle}>Heb je een tuin/terras?</Text>
        <RadioButton
          label="Ja, omheind"
          value="ja_omheind"
          selected={tuin}
          onSelect={setTuin}
        />
        <RadioButton
          label="Ja, niet omheind"
          value="ja_niet_omheind"
          selected={tuin}
          onSelect={setTuin}
        />
        <RadioButton
          label="Neen"
          value="neen"
          selected={tuin}
          onSelect={setTuin}
        />

        <Text style={styles.sectionTitle}>Woonomgeving</Text>
        <RadioButton
          label="Stedelijk"
          value="stedelijk"
          selected={omgeving}
          onSelect={setOmgeving}
        />
        <RadioButton
          label="Buitenwijk"
          value="buitenwijk"
          selected={omgeving}
          onSelect={setOmgeving}
        />
        <RadioButton
          label="Landelijk"
          value="landelijk"
          selected={omgeving}
          onSelect={setOmgeving}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>VOLGENDE</Text>
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
    width: "11.11%",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

export default LivingSituationScreen1;
