import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = () => {
    return (
      <View style={styles.container}>
         <View style={styles.header}>
        <Text style={styles.title}>Profiel</Text>
        <Image source={require("../../assets/images/settingicon.png")} style={styles.settingsIcon} />
        </View>
  
        {/* Profielsectie */}
     <View style={styles.profileSection}>
      <View style={styles.profileInfoContainer}>
        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.textprofileEmail}>Email</Text>
          <Text style={styles.profileEmail}>John@Doe.com</Text>
        </View>
      </View>
      
      {/* De bewerk-knop onder de tekst */}
      <TouchableOpacity style={styles.editButton}>
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
        marginBottom: 60,
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
    settingsIcon: {
        width:30,
        height: 31,
        position: "absolute",
        right: 20, 
        top: 5,
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