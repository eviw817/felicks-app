import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import Auth from "../../../../components/Auth";
import { Session } from "@supabase/supabase-js";
import { useRouter, Link } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { AppStateStatus } from "react-native";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Registeren() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const [firstnameFocus, setFirstnameFocus] = useState(false);
  const [lastnameFocus, setlastnameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [loading, setLoading] = useState(false);

  // Geboortedatum state
  const [day, setDay] = useState("01");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2000");

  // Functie om te controleren of er tekst is ingevoerd
  const isFirstnameFilled = firstname.trim() !== "";
  const isLastnameFilled = lastname.trim() !== "";
  const isEmailFilled = email.trim() !== "";
  const isPasswordFilled = password.trim() !== "";

  useEffect(() => {
    // Functie om sessie op te halen
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    // Auto-refresh sessie bij het teruggaan naar de app
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh(); // Zorgt ervoor dat sessie automatisch vernieuwd wordt
        fetchSession(); // Haal de sessie opnieuw op
      } else {
        supabase.auth.stopAutoRefresh(); // Stop de auto-refresh als de app niet actief is
      }
    };

    // Voeg de event listener toe
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Return een cleanup functie om de event listener te verwijderen
    return () => {
      appStateSubscription.remove(); // Gebruik de `remove()` methode om de listener te verwijderen
    };
  }, []);

  useEffect(() => {
    if (!session) {
      // Reset gegevens bij uitloggen of als er geen sessie is
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setBirthdate("");
      setDay("01");
      setMonth("01");
      setYear("2000");
    } else {
      // Haal gebruikersgegevens op bij sessie
      const fetchProfileData = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("firstname, lastname, email, birthdate")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setFirstname(data.firstname);
          setLastname(data.lastname);
          setEmail(data.email);
          setBirthdate(data.birthdate);
          const [year, month, day] = data.birthdate.split("-");
          setYear(year);
          setMonth(month);
          setDay(day);
        }
      };
      fetchProfileData();
    }
  }, [session]);

  async function signUpWithEmail() {
    setLoading(true);
    const birthDate = new Date(`${year}-${month}-${day}`);
    let age = new Date().getFullYear() - birthDate.getFullYear(); // Gebruik let i.p.v. const
    const monthDifference = new Date().getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && new Date().getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      Alert.alert("Je moet minimaal 18 jaar oud zijn om je te registreren.");
      setLoading(false);
      return;
    }
    // Sign up user with email and password
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.log("Error signing up:", error);
      Alert.alert(
        "Fout",
        "Er is een fout opgetreden bij het registreren. Probeer het opnieuw."
      );
      setLoading(false);
      return;
    }
    console.log("Sign-up successful, session:", session);

    if (!session) {
      Alert.alert("Check uw email voor verificatie");
      setLoading(false);
      return;
    } else {
      // First, check if the profile already exists
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (data) {
        // If profile already exists, update it
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ firstname, lastname, birthdate: `${year}-${month}-${day}` })
          .eq("id", session.user.id);

        if (updateError) {
          Alert.alert("Er is een probleem bij het updaten van uw profiel.");
          setLoading(false);
          return;
        }
      } else {
        // If profile doesn't exist, insert a new one
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: session.user.id, // Associate the profile with the user
            firstname: firstname,
            lastname: lastname,
            birthdate: `${year}-${month}-${day}`,
          },
        ]);

        if (insertError) {
          Alert.alert(
            "Er is een probleem bij het opslagen van uw profiel. Probeer het opnieuw"
          );
          setLoading(false);
          return;
        }
      }
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setDay("01");
      setMonth("01");
      setYear("2000");

      // Redirect to login page
      router.push("/adoptionprofile1");
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ width: "100%" }}
      >
        {session ? (
          <Auth key={session.user.id} session={session} />
        ) : (
          <>
            <Text style={styles.title}>Registreren</Text>

            {/* Voornaam input */}
            <Text style={styles.label}>Voornaam</Text>
            <TextInput
              style={[
                styles.input,
                firstnameFocus || isFirstnameFilled
                  ? styles.focusedInput
                  : styles.unfocusedInput,
              ]}
              placeholder="Voornaam"
              placeholderTextColor="rgba(151, 184, 165, 0.5)"
              keyboardType="default"
              onFocus={() => setFirstnameFocus(true)}
              onBlur={() => setFirstnameFocus(false)}
              onChangeText={setFirstname}
              value={firstname}
            />

            {/* Achternaam input */}
            <Text style={styles.label}>Achternaam</Text>
            <TextInput
              style={[
                styles.input,
                lastnameFocus || isLastnameFilled
                  ? styles.focusedInput
                  : styles.unfocusedInput,
              ]}
              placeholder="Achternaam"
              placeholderTextColor="rgba(151, 184, 165, 0.5)"
              keyboardType="default"
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
                  <Picker.Item
                    key={index}
                    label={String(index + 1).padStart(2, "0")}
                    value={String(index + 1).padStart(2, "0")}
                  />
                ))}
              </Picker>

              {/* Maand picker */}
              <Picker
                selectedValue={month}
                style={styles.picker}
                onValueChange={(itemValue) => setMonth(itemValue)}
              >
                {[...Array(12)].map((_, index) => (
                  <Picker.Item
                    key={index}
                    label={String(index + 1).padStart(2, "0")}
                    value={String(index + 1).padStart(2, "0")}
                  />
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
                    <Picker.Item
                      key={index}
                      label={String(yearValue)}
                      value={String(yearValue)}
                    />
                  );
                })}
              </Picker>
            </View>

            {/* E-mail input */}
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[
                styles.input,
                emailFocus || isEmailFilled
                  ? styles.focusedInput
                  : styles.unfocusedInput,
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
                passwordFocus || isPasswordFilled
                  ? styles.focusedInput
                  : styles.unfocusedInput,
              ]}
              placeholder="Wachtwoord"
              placeholderTextColor="rgba(151, 184, 165, 0.5)"
              secureTextEntry
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              onChangeText={setPassword}
              value={password}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={async () => await signUpWithEmail()}
            >
              <Text style={styles.buttonText}>REGISTREER</Text>
            </TouchableOpacity>

            {/* Inloggen link */}
            <Text style={styles.registerText}>
              Al een account?{" "}
              <Link style={styles.registerLink} href="/login">
                Inloggen
              </Link>
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFDF9",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#183A36",
    marginBottom: 60,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
    borderColor: "#97B8A5",
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 15,
  },
  picker: {
    width: "30%",
    height: 50,
  },
  button: {
    backgroundColor: "#97B8A5",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    width: "97%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#183A36",
    fontSize: 16,
    fontWeight: "bold",
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
    paddingLeft: 15,
  },
  focusedInput: {
    borderBottomColor: "#183A36",
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
    alignItems: "flex-end",
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

// import 'react-native-url-polyfill/auto'
// import { useState, useEffect } from 'react'
// import { supabase } from '../../lib/supabase'
// import Auth from '../../components/Auth'
// import { View, Text } from 'react-native'
// import { Session } from '@supabase/supabase-js'

// export default function Registeren() {
//   const [session, setSession] = useState<Session | null>(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       console.log("Session from getSession:", session);

//       setSession(session)
//     })

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       console.log("Session from auth state change:", session);
//       setSession(session)
//     })

//     return () => {
//       authListener?.subscription.unsubscribe();
//     };
//   }, [])

//   return (
//     <View>
//       {session && session.user ? <Auth key={session.user.id} session={session} /> : <Text>No user session</Text> }
//     </View>
//   )
// }

// import React,{ useState, useEffect } from 'react'
// import { supabase } from '../../lib/supabase'
// import Auth from '../../components/Account'
// import { View, Text } from 'react-native'
// import { Session } from '@supabase/supabase-js'

// export default function Registeren() {
//   const [session, setSession] = useState<Session | null>(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       console.log("Fetched session:", session);
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       console.log("Auth state changed:", session);
//       setSession(session)
//     })

//   }, [])

//   return (
//     <View>
//       {session && session.user ? <Auth key={session.user.id} session={session} /> : <Text>No user session</Text> }
//     </View>
//   )
// }

// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
// import { useRouter } from "expo-router";
// import { Picker } from '@react-native-picker/picker';

// const RegisterScreen = () => {
//   const router = useRouter();
//   const [firstnameFocus, setFirstnameFocus] = useState(false);
//   const [lastnameFocus, setlastnameFocus] = useState(false);
//   const [emailFocus, setEmailFocus] = useState(false);
//   const [passwordFocus, setPasswordFocus] = useState(false);
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//    // Geboortedatum state
//    const [day, setDay] = useState('01');
//    const [month, setMonth] = useState('01');
//    const [year, setYear] = useState('2000');

//   // Functie om te controleren of er tekst is ingevoerd
//   const isFirstnameFilled = firstname.trim() !== '';
//   const isLastnameFilled = lastname.trim() !== '';
//   const isEmailFilled = email.trim() !== '';
//   const isPasswordFilled = password.trim() !== '';

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Registreren</Text>

//       {/* Voornaam input */}
//       <Text style={styles.label}>Voornaam</Text>
//       <TextInput
//         style={[
//           styles.input,
//           firstnameFocus || isFirstnameFilled ? styles.focusedInput : styles.unfocusedInput
//         ]}
//         placeholder="Voornaam"
//         placeholderTextColor="rgba(151, 184, 165, 0.5)"
//         keyboardType="default"
//         onFocus={() => setFirstnameFocus(true)}
//         onBlur={() => setFirstnameFocus(false)}
//         onChangeText={setFirstname}
//         value={firstname}
//       />

//       {/* achternaam input */}
//       <Text style={styles.label}>Achternaam</Text>
//       <TextInput
//         style={[
//           styles.input,
//           lastnameFocus || isLastnameFilled ? styles.focusedInput : styles.unfocusedInput
//         ]}
//         placeholder="Achternaam"
//         placeholderTextColor="rgba(151, 184, 165, 0.5)"
//         keyboardType="default"
//         onFocus={() => setlastnameFocus(true)}
//         onBlur={() => setlastnameFocus(false)}
//         onChangeText={setLastname}
//         value={lastname}
//       />

//        {/* Geboortedatum picker */}
//        <Text style={styles.label}>Geboortedatum</Text>
//       <View style={styles.datePickerContainer}>
//         {/* Dag picker */}
//         <Picker
//           selectedValue={day}
//           style={styles.picker}
//           onValueChange={(itemValue) => setDay(itemValue)}
//         >
//           {[...Array(31)].map((_, index) => (
//             <Picker.Item key={index} label={String(index + 1).padStart(2, '0')} value={String(index + 1).padStart(2, '0')} />
//           ))}
//         </Picker>

//         {/* Maand picker */}
//         <Picker
//           selectedValue={month}
//           style={styles.picker}
//           onValueChange={(itemValue) => setMonth(itemValue)}
//         >
//           {[...Array(12)].map((_, index) => (
//             <Picker.Item key={index} label={String(index + 1).padStart(2, '0')} value={String(index + 1).padStart(2, '0')} />
//           ))}
//         </Picker>

//         {/* Jaar picker */}
//         <Picker
//           selectedValue={year}
//           style={styles.picker}
//           onValueChange={(itemValue) => setYear(itemValue)}
//         >
//           {[...Array(100)].map((_, index) => {
//             const yearValue = 2023 - index;
//             return (
//               <Picker.Item key={index} label={String(yearValue)} value={String(yearValue)} />
//             );
//           })}
//         </Picker>
//         </View>
//       {/* E-mail input */}
//       <Text style={styles.label}>E-mail</Text>
//       <TextInput
//         style={[
//           styles.input,
//           emailFocus || isEmailFilled ? styles.focusedInput : styles.unfocusedInput
//         ]}
//         placeholder="E-mail"
//         placeholderTextColor="rgba(151, 184, 165, 0.5)"
//         keyboardType="email-address"
//         onFocus={() => setEmailFocus(true)}
//         onBlur={() => setEmailFocus(false)}
//         onChangeText={setEmail}
//         value={email}
//       />

//       {/* Wachtwoord input */}
//       <Text style={styles.label}>Wachtwoord</Text>
//       <TextInput
//         style={[
//           styles.input,
//           passwordFocus || isPasswordFilled ? styles.focusedInput : styles.unfocusedInput
//         ]}
//         placeholder="Wachtwoord"
//         placeholderTextColor="rgba(151, 184, 165, 0.5)"
//         secureTextEntry
//         onFocus={() => setPasswordFocus(true)}
//         onBlur={() => setPasswordFocus(false)}
//         onChangeText={setPassword}
//         value={password}
//       />

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>REGISTREER</Text>
//       </TouchableOpacity>

//       {/* Inloggen link */}
//       <Text style={styles.registerText}>
//         Al een account?{" "}
//         <Text style={styles.registerLink} onPress={() => router.push("/login/login")}>
//           Inloggen
//         </Text>
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 100,
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFDF9',
//   },
//   title: {
//     fontSize: 23,
//     fontWeight: "bold",
//     color: '#183A36',
//     marginBottom: 60,
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   datePickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 25,
//     borderColor: '#97B8A5',
//     borderWidth: 2,
//     borderRadius: 20,
//     paddingLeft: 15,
//   },
//   picker: {
//     width: '30%',
//     height: 50,
//   },
//   button: {
//     backgroundColor: '#97B8A5',
//     paddingVertical: 15,
//     borderRadius: 20,
//     marginBottom: 20,
//     width: '97%',
//     alignItems: 'center',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     color: '#183A36',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   label: {
//     alignSelf: "flex-start",
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#183A36",
//     marginBottom: 5,
//   },
//   input: {
//     width: "100%",
//     height: 45,
//     borderBottomWidth: 1,
//     borderBottomColor: "#97B8A5",
//     marginBottom: 25,
//     fontSize: 16,
//     color: "#183A36",
//     paddingLeft: 15,
//   },
//   focusedInput: {
//     borderBottomColor: '#183A36',
//   },
//   unfocusedInput: {
//     borderBottomColor: "#97B8A5",
//   },
//   forgotPassword: {
//     alignSelf: "flex-end",
//     textAlign: "right",
//     color: "#183A36",
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   forgotPasswordContainer: {
//     width: "100%",
//     alignItems: 'flex-end',
//     marginBottom: 30,
//   },
//   registerText: {
//     fontSize: 14,
//     color: "#183A36",
//   },
//   registerLink: {
//     fontWeight: "bold",
//   },
// });

// export default RegisterScreen;
