import React from "react";

import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal, Alert} from "react-native";
import { SafeAreaView, KeyboardAvoidingView, Platform, ScrollView }from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import { supabase } from "../../../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Avatar from "../../../../components/Avatar";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";
import { Ionicons } from "@expo/vector-icons";

const ProfileEditScreen = () => {
    const router = useRouter();
    const [firstnameFocus, setFirstnameFocus] = useState(false);
    const [lastnameFocus, setlastnameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState<string>('');
    const [birthdate, setBirthdate] = useState('');
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const cleanEmail = email.trim();

     // Geboortedatum state
     const [day, setDay] = useState('01');
     const [month, setMonth] = useState('01');
     const [year, setYear] = useState('2000');
  
    // Functie om te controleren of er tekst is ingevoerd
    const isFirstnameFilled = firstname.trim() !== '';
    const isLastnameFilled = lastname.trim() !== '';
    const isEmailFilled = email.trim() !== '';
    const isPasswordFilled = password.trim() !== '';

    
    useEffect(() => {
      const fetchSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);  // Zorg ervoor dat de session wordt geladen.
      };

      fetchSession();  // Haal de sessie op
      }, []);

      useEffect(() => {
        if (session?.user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from("profiles")
                    .select()
                    .eq("id", session.user.id)
                    .single();

                if (error) {
                    Alert.alert("Fout", "Er is een probleem bij het ophalen van je profielgegevens.");
                    return;
                }

                if (data) {
                    setFirstname(data.firstname || "");
                    setLastname(data.lastname || "");
                    setEmail(session.user.email || '');
                    setBirthdate(data.birthdate || "");

                    if (data.birthdate) {
                        const [yearValue, monthValue, dayValue] = data.birthdate.split("-");
                        setYear(yearValue);
                        setMonth(monthValue);
                        setDay(dayValue);
                    }
                }
            };

            fetchProfile();  // Haal profiel op zodra de sessie geladen is
        }
    }, [session]);

      
    const updateProfile = async () => {
      setLoading(true);

      const updatedFields: { [key: string]: any } = {};
  
      if (firstname !== "") updatedFields.firstname = firstname;
      if (lastname !== "") updatedFields.lastname = lastname;
      if (birthdate !== "") updatedFields.birthdate = `${year}-${month}-${day}`;

      if (email !== session?.user.email) updatedFields.email = email;
  
      if (Object.keys(updatedFields).length === 0) {
        Alert.alert("Geen wijzigingen", "Je hebt geen gegevens gewijzigd.");
        setLoading(false);
        return;
      }
  
      const { error: profileError } = await supabase
        .from("profiles")
        .update(updatedFields)
        .eq("id", session?.user.id);
  
      if (profileError) {
        Alert.alert("Fout", "Er is een probleem bij het bijwerken van je profiel.");
        setLoading(false);
        return;
      }

      if (email !== session?.user.email) {

        try {
            const { data, error } = await supabase.auth.updateUser({
              email: cleanEmail,
            },
            {
              emailRedirectTo: 'com.anonymous.felicksapp://profile/profile', // Dit is de deep link naar je profielpagina
            });
            if (error) {
              Alert.alert("Fout", "Er is een probleem bij het bijwerken van je e-mailadres.");
              console.error("Email update error: ", error);
            } else {
              Alert.alert("Succes", "Je e-mailadres is succesvol bijgewerkt. Er wordt een bevestigingsmail verzonden naar je nieuwe e-mailadres.");
            }
          } catch (error) {
            Alert.alert("Fout", "Er is een probleem bij het bijwerken van je e-mailadres.");
            console.error("Error updating email: ", error);
          }
        }
      
        // Redirect after successful profile update
        router.push("../profile");
        setLoading(false);
      };

    const updateAvatar = async (url: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", session?.user.id);
  
      if (error) {
        Alert.alert("Fout", "Er is een probleem bij het updaten van je profielfoto.");
      } else {
        // Alert.alert("Succes", "Je profielfoto is bijgewerkt!");
      }
    };

    useEffect(() => {
      async function fetchAvatar() {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", session?.user.id)
          .single();
    
        if (error) {
          console.error("Error fetching avatar:", error.message);
        } else {
          setAvatarUrl(data?.avatar_url);
        }
      }
    
      if (session?.user.id) {
        fetchAvatar();
      }
    }, [session]);
    
       const goToSettings = () => {
        router.push('/settings');
      };
    

    
    return (
      <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100}}>
      <SafeAreaView  style={styles.container} >
         <View style={styles.header}>
         <TouchableOpacity onPress={() => router.push("/profile")} style={styles.backButton}>
         <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
        </TouchableOpacity>
          <BaseText style={styles.title}>Profiel bewerken</BaseText>
            <TouchableOpacity onPress={goToSettings} style={styles.settingsicon}>
               <Ionicons name="settings-outline" size={32} color="#183A36" />
            </TouchableOpacity>
        </View>
  
        {/* Profielsectie */}
        <View style={styles.profileSection}>
        <View style={styles.profileInfoContainer}>
          <Avatar
            size={100}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url)
              updateAvatar(url);
            }}
          />
        </View>
      </View>
  

   {/* Voornaam input */}
   <Text style={styles.label}>Voornaam</Text>
    <TextInput
      style={[
        styles.input, 
        firstnameFocus || isFirstnameFilled ? styles.focusedInput : styles.unfocusedInput
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
        lastnameFocus || isLastnameFilled ? styles.focusedInput : styles.unfocusedInput
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
    <TouchableOpacity
        style={[
          styles.input,
          passwordFocus || isPasswordFilled ? styles.focusedInput : styles.unfocusedInput,
          { justifyContent: 'center' } // centreren van de tekst
        ]}
        onPress={() => setModalVisible(true)}
        onFocus={() => setEmailFocus(true)} 
        onBlur={() => setEmailFocus(false)} 
        activeOpacity={0.7}
      >
        <Text style={{ color: '#183A36'}}>
          ****** {/* Je zou hier eventueel `password.length` sterretjes kunnen tonen */}
        </Text>
      </TouchableOpacity>
    {/* Popup (modal) */}
    <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Ben je zeker dat je je wachtwoord wilt veranderen?
            </Text>

            {/* Knoppen in de popup */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.buttons} 
                onPress={() => {
                  setModalVisible(false);
                  router.push("/forgetPassword");
                }}
              >
                <Text style={styles.buttonText}>Ja</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.buttons, styles.noButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Neen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    <TouchableOpacity style={styles.button} onPress={updateProfile}>
      <Text style={styles.buttonText}>OPSLAAN</Text>
    </TouchableOpacity>

  </SafeAreaView>
  </ScrollView>
   {/* Fixed navbar onderaan scherm */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <NavBar />
        </View>
  </KeyboardAvoidingView>
  {/* Fixed navbar onderaan scherm */}
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    }}>
    <NavBar />
  </View>
  </SafeAreaView>
    );
  };

  
  const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFDF9',
        fontFamily: 'Nunito',
        paddingBottom: 70, // Extra padding om ruimte te maken voor de navbar
    },
    title: {
         fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 20,
    },
    backButton: {
      position: "absolute",
      left: 5,
      top:7,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        width: "100%",
        position: "relative", 
        paddingVertical: 10,
      },
     settingsicon: {
      position: "absolute",
      right: 15, 
      top: 12,
    },
    profileSection: { 
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center", 
      width: "50%",
      position: "relative", 
      marginBottom: 30 
    },
    profileInfoContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },
    profileImage: {
        width: 100, 
        height: 100,
        borderRadius: 40, 
        backgroundColor: "#ddd",
        marginRight: 60,
    },
    profileInfo: {
        flexDirection: 'column', 
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#183A36',
    },
    textprofileEmail: {
        fontSize: 15,
        color: 'gray',  
        marginTop: 5,    
    },
    profileEmail: { 
        fontSize: 15, 
        color: '#183A36',
        marginBottom: 10, 
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
        fontWeight: "bold", 
      },
      noButton: {
        backgroundColor: 'transparent',  
        borderWidth: 2,                 
        borderColor: '#97B8A5',          
        borderRadius: 15,                
        padding: 15,                     
        marginHorizontal: 5,             
        alignItems: 'center',            
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
        borderBottomColor: '#183A36', 
      },
      unfocusedInput: {
        borderBottomColor: "#97B8A5", 
      },

      modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)", 
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 0,
        padding: 20,
      },
      modalContainer: {
        backgroundColor: '#FFFDF9',
        padding: 40,
        borderRadius: 15,
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        fontSize: 16,
        textAlign: "left",
        marginBottom: 20,
        color: '#183A36',
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      },
      buttons: {
        flex: 1,
        backgroundColor: "#88A68C", 
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        alignItems: "center",
      },
      
  });

  export default ProfileEditScreen;