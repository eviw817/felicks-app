import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons';
import Avatar from "../../../components/Avatar";

const ProfileScreen = () => {
      const router = useRouter();
      const [firstname, setFirstname] = useState('');
      const [lastname, setLastname] = useState('');
      const [email, setEmail] = useState<string>('');
      const [session, setSession] = useState<Session | null>(null);
      const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
      const [userId, setUserId] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);

      const fetchUserData = async () => {
        setLoading(true);
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw new Error('Kan sessie niet ophalen.');
    
          setSession(session);
    
          if (session?.user?.id) {
            const { data, error } = await supabase
              .from("profiles")
              .select("firstname, lastname, avatar_url")
              .eq("id", session.user.id)
              .single();
    
            if (error) throw new Error('Er is een probleem bij het ophalen van je profielgegevens.');
    
            setFirstname(data.firstname || "");
            setLastname(data.lastname || "");
            setEmail(session.user.email || '');
            setAvatarUrl(data.avatar_url || null);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    
      // Vernieuw de sessie en email
      const updateSessionAndEmail = async () => {
        const { data: refreshedSession, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Kon sessie niet vernieuwen", error);
          return;
        }
        setSession(refreshedSession.session);
        setEmail(refreshedSession.session?.user?.email ?? '');
      };
    
      // Roep de sessie update aan wanneer de pagina weer zichtbaar wordt
      useFocusEffect(
        useCallback(() => {
          updateSessionAndEmail();
        }, [])
      );
    
      // Haal gebruikersgegevens op bij het laden van de pagina
      useEffect(() => {
        fetchUserData();
      }, []);

      const goToSettings = () => {
        router.push('/settings');
      };
    

    return (
      <View style={styles.container}>
         <View style={styles.header}>
        <Text style={styles.title}>Profiel</Text>
       <TouchableOpacity onPress={goToSettings} style={styles.settingsicon}>
         <FontAwesomeIcon icon={faGear} size={28} color={'#183A36'}  />
       </TouchableOpacity>
        </View>
  
        {/* Profielsectie */}
     <View style={styles.profileSection}>
     <View style={styles.profileInfoContainer}>
    <Avatar size={100} url={avatarUrl} onUpload={(url) => setAvatarUrl(url)} showUploadButton={false} />

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{`${firstname} ${lastname}`}</Text>
        <Text style={styles.textprofileEmail}>E-mail</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>
    </View>

      
      {/* De bewerk-knop onder de tekst */}
      <TouchableOpacity style={styles.editButton}  onPress={() => router.push("../profileEdit/profileEdit")}>
        <Text style={styles.editButtonText}>BEWERKEN</Text>
      </TouchableOpacity>
    </View>
  
        {/* Info Secties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jouw favoriete hond(en)</Text>
          <Text style={styles.sectionText}>
            Als je een hond liket dan kan je deze hier terugvinden.
          </Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formulier in behandeling</Text>
          <Text style={styles.sectionText}>
            Wanneer u een aanvraag doet, wordt je formulier doorgestuurd naar het asiel, je kan de
            status hiervan bij je profiel vinden.
          </Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionSubtile}>Deze honden passen bij jou profiel:</Text>
          <Text style={styles.sectionText}>
            Om te bepalen welke hond(en) het beste bij jou passen, vragen we je om eerst de
            vragenlijst in te vullen. Zo kunnen we een perfecte match voor je vinden!
          </Text>
        </View>
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
        fontFamily: 'Nunito'
    },
    title: {
        fontSize: 23,
        fontWeight: "bold",
        color: '#183A36',
        marginBottom: 30,
        textAlign: "center",
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
        alignItems: "center", 
        marginBottom: 30 
    },
    profileInfoContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },
    profileImage: {
        width: 80, 
        height: 80,
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
    editButton: { 
        backgroundColor: "#8AB89D",
        marginTop: 25,
        paddingVertical: 10, 
        paddingHorizontal: 90, 
        borderRadius: 15 
    },
    editButtonText: { 
        color: '#183A36',
        fontWeight: "bold", 
        fontSize: 14,
    },
    section: { 
        marginBottom: 20, 
        alignSelf: 'stretch',  
        alignItems: 'flex-start', 
        paddingHorizontal: 10, 
    },
    sectionTitle: { 
        fontSize: 24, 
        color: '#183A36',
        fontWeight: "semibold", 
        marginBottom: 5 
    },
    sectionSubtile:{
        fontSize: 18, 
        color: '#183A36',
        fontWeight: "semibold", 
        marginBottom: 5 
    },
    sectionText: { 
        fontSize: 15,
        color: '#183A36',
    },
  });
  
  export default ProfileScreen;