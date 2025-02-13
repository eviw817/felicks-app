import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";  
import { Picker } from '@react-native-picker/picker';

const RegisterScreen = () => {
  const router = useRouter();
  const [firstnameFocus, setFirstnameFocus] = useState(false);
  const [lastnameFocus, setlastnameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   // Geboortedatum state
   const [day, setDay] = useState('01');
   const [month, setMonth] = useState('01');
   const [year, setYear] = useState('2000');

  // Functie om te controleren of er tekst is ingevoerd
  const isFirstnameFilled = firstname.trim() !== '';
  const isLastnameFilled = lastname.trim() !== '';
  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registreren</Text>

      {/* Voornaam input */}
      <Text style={styles.label}>Voornaam</Text>
      <TextInput
        style={[
          styles.input, 
          firstnameFocus || isFirstnameFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="E-mail" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        keyboardType="email-address"
        onFocus={() => setFirstnameFocus(true)} 
        onBlur={() => setFirstnameFocus(false)} 
        onChangeText={setFirstname}
        value={firstname}
      />

      {/* achternaam input */}
      <Text style={styles.label}>Achternaam</Text>
      <TextInput
        style={[
          styles.input, 
          lastnameFocus || isLastnameFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="E-mail" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        keyboardType="email-address"
        onFocus={() => setlastnameFocus(true)} 
        onBlur={() => setlastnameFocus(false)} 
        onChangeText={setLastname}
        value={lastname}
      />

       {/* Geboortedatum picker */}
       <Text style={styles.label}>Geboortedatum</Text>
      <View style={styles.datePickerContainer}>
        {/* Dag picker */}
        <Picker
          selectedValue={day}
          style={styles.picker}
          onValueChange={(itemValue) => setDay(itemValue)}
        >
          {[...Array(31)].map((_, index) => (
            <Picker.Item key={index} label={String(index + 1).padStart(2, '0')} value={String(index + 1).padStart(2, '0')} />
          ))}
        </Picker>

        {/* Maand picker */}
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          {[...Array(12)].map((_, index) => (
            <Picker.Item key={index} label={String(index + 1).padStart(2, '0')} value={String(index + 1).padStart(2, '0')} />
          ))}
        </Picker>

        {/* Jaar picker */}
        <Picker
          selectedValue={year}
          style={styles.picker}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          {[...Array(100)].map((_, index) => {
            const yearValue = 2023 - index;
            return (
              <Picker.Item key={index} label={String(yearValue)} value={String(yearValue)} />
            );
          })}
        </Picker>
        </View>
      {/* E-mail input */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[
          styles.input, 
          emailFocus || isEmailFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="E-mail" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        keyboardType="email-address"
        onFocus={() => setEmailFocus(true)} 
        onBlur={() => setEmailFocus(false)} 
        onChangeText={setEmail}
        value={email}
      />

      {/* Wachtwoord input */}
      <Text style={styles.label}>Wachtwoord</Text>
      <TextInput
        style={[
          styles.input, 
          passwordFocus || isPasswordFilled ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="Wachtwoord" 
        placeholderTextColor="rgba(151, 184, 165, 0.5)"
        secureTextEntry 
        onFocus={() => setPasswordFocus(true)} 
        onBlur={() => setPasswordFocus(false)} 
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>REGISTREER</Text>
      </TouchableOpacity>

      {/* Inloggen link */}
      <Text style={styles.registerText}>
        Al een account?{" "}
        <Text style={styles.registerLink} onPress={() => router.push("/login/login")}>
          Inloggen
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFDF9',
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: '#183A36',
    marginBottom: 60,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
    borderColor: '#97B8A5', 
    borderWidth: 2, 
    borderRadius: 20, 
    paddingLeft: 15,
  },
  picker: {
    width: '30%',
    height: 50,
  },
  button: {
    backgroundColor: '#97B8A5',
    paddingVertical: 15,
    borderRadius: 20, 
    marginBottom: 20,
    width: '97%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#183A36',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: "#183A36",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#97B8A5", 
    marginBottom: 25,
    fontSize: 16,
    color: "#183A36",
  },
  focusedInput: {
    borderBottomColor: '#183A36', 
  },
  unfocusedInput: {
    borderBottomColor: "#97B8A5", 
  },
  forgotPassword: {
    alignSelf: "flex-end",
    textAlign: "right",
    color: "#183A36",
    fontSize: 14,
    marginBottom: 5,
  },
  forgotPasswordContainer: {
    width: "100%", 
    alignItems: 'flex-end', 
    marginBottom: 30,
  },
  registerText: {
    fontSize: 14,
    color: "#183A36",
  },
  registerLink: {
    fontWeight: "bold",
  },
});

export default RegisterScreen;
