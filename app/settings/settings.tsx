import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
// import { supabase } from "../../lib/supabase";
// import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faBell, faPaw, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons";


const SettingsScreen = () => {
      const router = useRouter();
  
    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.title}>Instellingen</Text>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/settings/hulp/hulp")}>
                    <View style={styles.leftSection}>
                        <FontAwesomeIcon icon={faCircleInfo} size={30} color="#183A36" />
                        <Text style={styles.menuText}>Hulp</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/settings/notification/notification")}>
                    <View style={styles.leftSection}>
                        <FontAwesomeIcon icon={faBell} size={30} color="#183A36" />
                        <Text style={styles.menuText}>Meldingen</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.leftSection}>
                        <FontAwesomeIcon icon={faPaw} size={30} color="#183A36" />
                        <Text style={styles.menuText}>Pas je huisdier aan</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>
            </View>


            {/* Afmelden & Account verwijderen */}
            <View style={styles.logoutSection}>
                <TouchableOpacity>
                <Text style={styles.logoutText}>Afmelden</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                <Text style={styles.deleteText}>Account verwijderen</Text>
                </TouchableOpacity>
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        width: "100%",
        position: "relative", 
        paddingVertical: 10,
      },
    title: {
        fontSize: 23,
        fontWeight: "bold",
        color: '#183A36',
        marginBottom: 20,
        textAlign: "center",
    },
    backButton: {
      position: "absolute",
      left: 5,
      top:7,
    },
    menu: {
        marginVertical: 10,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center", 
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        width: "100%", 
    },
      menuText: {
        fontSize: 16,
        marginLeft: 15, 
      },
    arrowIcon: {
        marginRight: 10,
    },
    logoutSection: {
        marginTop: 30,
        width: "100%",
    },
    logoutText: {
        fontSize: 16,
        color: "#F18B7E",
        marginBottom: 25,
        alignSelf: "flex-start",
    },
    deleteText: {
        fontSize: 16,
        color: "#F18B7E",
        alignSelf: "flex-start",
    },
  });
  
  export default SettingsScreen;