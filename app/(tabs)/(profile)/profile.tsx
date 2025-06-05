import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons';
import BaseText from "@/components/BaseText";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import NavBar from "@/components/NavigationBar";

interface Dog {
  id: string;
  name: string;
  breed: string;
  birthdate: string;
  size: string;
  activity_level: string;
  child_friendly_under_6: boolean;
  child_friendly_over_6: boolean;
  house_trained: boolean;
  social_with_dogs: boolean;
  social_with_cats: boolean;
  description: string;
  images: string[];
  shelter: string;
}

const getAgeCategory = (birthdate: string): string => {
  const birth = new Date(birthdate);
  const now = new Date();
  const age = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (age < 1) return "puppy";
  if (age < 3) return "jong_volwassen";
  if (age < 8) return "volwassen";
  return "senior";
};


const ProfileScreen = () => {
      const router = useRouter();
      const [firstname, setFirstname] = useState('');
      const [lastname, setLastname] = useState('');
      const [email, setEmail] = useState<string>('');
      const [session, setSession] = useState<Session | null>(null);
      const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
      const [userId, setUserId] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
// Removed unused formSubmitted state declaration.
      const [formStatus, setFormStatus] = useState<"niet_ingediend" | "ingediend" | "goedgekeurd" | "in_behandeling">("niet_ingediend");
      const [matches, setMatches] = useState<{ dog: Dog; score: number }[]>([]);
      const [likedDogs, setLikedDogs] = useState<Dog[]>([]);

      const fetchUserData = async () => {
        setLoading(true);
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw new Error('Kan sessie niet ophalen.');
    
          setSession(session);
    
          if (session?.user?.id) {
            const { data, error } = await supabase
              .from("profiles")
              .select("id, firstname, lastname, avatar_url")
              .eq("id", session.user.id)
              .single();
    
            if (error) throw new Error('Er is een probleem bij het ophalen van je profielgegevens.');
    
            setFirstname(data.firstname || "");
            setLastname(data.lastname || "");
            setEmail(session.user.email || '');
            setAvatarUrl(data.avatar_url || null);

            const { data: prefs } = await supabase
              .from("adoption_dog_preferences")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            const { data: dogs } = await supabase.from("adoption_dogs").select("*");

            if (prefs && dogs) {
              const scored = await Promise.all(
                dogs.map(async (dog: Dog) => {
                  let score = 0;
                  let total = 0;

                  if (prefs.preferred_age && prefs.preferred_age !== "geen_voorkeur") {
                    total++;
                    const age = getAgeCategory(dog.birthdate);
                    if (prefs.preferred_age === age) score++;
                  }

                  if (prefs.training_level) {
                    total++;
                    if (prefs.training_level === "geen_voorkeur" || dog.house_trained) score++;
                  }

                  if (prefs.interaction_children) {
                    total++;
                    if (
                      prefs.interaction_children === "niet van toepassing" ||
                      dog.child_friendly_under_6 ||
                      dog.child_friendly_over_6
                    ) score++;
                  }

                  if (prefs.interaction_dogs) {
                    total++;
                    if (
                      prefs.interaction_dogs === "niet van toepassing" ||
                      (prefs.interaction_dogs === "goed" && dog.social_with_dogs) ||
                      (prefs.interaction_dogs === "beetje" && dog.social_with_dogs)
                    ) score++;
                  }

                  if (prefs.energy_preference) {
                    total++;
                    if (
                      (prefs.energy_preference === "enthousiasme" && dog.activity_level === "high") ||
                      (prefs.energy_preference === "ontspanning" && dog.activity_level !== "high")
                    ) score++;
                  }

                  const match_score = total === 0 ? 0 : Math.round((score / total) * 100);

                  return { dog, score: match_score };
                })
              );

              const filtered = scored.filter((match) => match.score >= 50);
              setMatches(filtered.sort((a, b) => b.score - a.score));
            }

           const { data: adoptionRequest, error: adoptionError } = await supabase
            .from("adoption_requests")
            .select("*")
            .eq("user_id", session.user.id);

            // console.log("Session user ID:", session.user.id);
            // console.log("Profile data user ID:", data.id);
            // console.log("Adoption requests:", adoptionRequest);
            // console.log("Adoption error:", adoptionError);

            if (adoptionError) {
              console.error("Fout bij ophalen adoptieverzoeken:", adoptionError);
            }

            if (adoptionRequest && adoptionRequest.length > 0) {
                if (adoptionRequest[0].status === "goedgekeurd") {
                  setFormStatus("goedgekeurd");
                } else if (adoptionRequest[0].status === "in_behandeling") {
                  setFormStatus("in_behandeling");
                } else {
                  setFormStatus("ingediend");
                }
              } else {
                setFormStatus("niet_ingediend");
              }

                }
              } catch (error) {
                console.error(error);
              } finally {
                setLoading(false);
              }

            if (session && session.user && session.user.id) {
              const { data: liked, error: likedError } = await supabase
              .from("liked_dogs")
              .select(`
                adoption_dogs (
                  id,
                  name,
                  breed
                )
              `)
              .eq("user_id", session.user.id);


              if (likedError) {
                console.error("Fout bij ophalen liked dogs:", likedError);
              } else if (liked) {
                const dogs = liked.map((entry: any) => entry.adoption_dogs);
                setLikedDogs(dogs);
              }
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
     <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 60, padding: 20, }}>
          <View style={styles.header}>
        <BaseText style={styles.title}>Profiel</BaseText>
       <TouchableOpacity onPress={goToSettings} style={styles.settingsicon}>
          <Ionicons name="settings-outline" size={32} color="#183A36" />
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
      <Link style={styles.editButton}
        href="/profileEdit">
        <Text style={styles.editButtonText}>BEWERKEN</Text>
      </Link>
    </View>
  
        {/* Info Secties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jouw favoriete hond(en)</Text>
          {likedDogs.length > 0 ? (
            likedDogs.map((dog) => (
              <TouchableOpacity
                key={dog.id}
                style={{
                  backgroundColor: "#E2F0E7",
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 10,
                  width: '100%',
                }}
                // onPress={() =>
                //   router.push({
                //     pathname: "/(tabs)/(adoptionprofile)/(personality)/dogDetail/[id]",
                //     params: { id: dog.id },
                //   })
                // }
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#183A36" }}>{dog.name}</Text>
                <Text style={{ color: "#97B8A5" }}>{dog.breed}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.sectionText}>
              Als je een hond liket dan kan je deze hier terugvinden.
            </Text>
          )}
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Deze honden passen bij jouw profiel:</Text>
          {matches.length > 0 && (
            <Text style={styles.sectionText}>
              Dit zijn enkele honden die bij jouw profiel passen. Wil je weten waarom? Klik dan op een hond.
            </Text>
          )}
          {matches.length === 0 ? (
            <Text style={styles.sectionText}>
              Om te bepalen welke hond(en) het beste bij jou passen, vragen we je om eerst de
              vragenlijst in te vullen. Zo kunnen we een perfecte match voor je vinden!
            </Text>
          ) : (
            matches.map((match) => (
              <TouchableOpacity
                key={match.dog.id}
                style={{
                  backgroundColor: "#E2F0E7",
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 10,
                  width: '100%',
                }}
                // onPress={() =>
                //   router.push({
                //     pathname: "/(tabs)/(adoptionprofile)/(personality)/dogDetail/[id]",
                //     params: { id: match.dog.id },
                //   })
                // }
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#183A36" }}>{match.dog.name}</Text>
                <Text style={{ color: "#97B8A5" }}>{match.score}% match</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

  
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Status van je aanvraag</Text>

      {formStatus === "goedgekeurd" && (
        <Text style={styles.sectionTextStatus}>
          Uw formulier werd goedgekeurd, wij sturen een mail naar het asiel en zij bekijken uw aanvraag verder. U zal een bericht krijgen als u op gesprek mag komen.
        </Text>
      )}

      {formStatus === "in_behandeling" && (
        <Text style={styles.sectionTextStatus}>
          We hebben uw formulier ontvangen en zijn ermee aan de slag.
        </Text>
      )}

      {formStatus === "niet_ingediend" && (
        <Text style={styles.sectionText}>
          Wanneer u een aanvraag doet, wordt uw formulier doorgestuurd naar het asiel. Je kan de status hiervan bij je profiel terugvinden.
        </Text>
      )}
    </View>


  
      
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
      
    </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: { 
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFDF9',
        fontFamily: 'Nunito'
    },
    title: {
        fontSize: 28,
        fontFamily: 'SireniaMedium',
        textAlign: "center",
        marginBottom: 30,

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
        borderRadius: 20 
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
    sectionSubtitle:{
        fontSize: 18, 
        color: '#183A36',
        fontWeight: "semibold", 
        marginBottom: 5 
    },
    sectionText: { 
        fontSize: 15,
        color: '#183A36',
    },
    sectionTextStatus: { 
        fontSize: 16, 
        color: '#183A36',
        backgroundColor: '#97B8A5',
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
   
    },
  });
  
  export default ProfileScreen;