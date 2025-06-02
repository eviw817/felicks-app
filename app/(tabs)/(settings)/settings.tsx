import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
// import { supabase } from "../../lib/supabase";
// import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faBell, faPaw, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";

const SettingsScreen = () => {
      const router = useRouter();
  
    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/profile")} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                </TouchableOpacity>
                <BaseText style={styles.title}>Instellingen</BaseText>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/help")}>
                    <View style={styles.leftSection}>
                        <FontAwesomeIcon icon={faCircleInfo} size={30} color="#183A36" />
                        <Text style={styles.menuText}>Hulp</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/notification")}>
                    <View style={styles.leftSection}>
                        <FontAwesomeIcon icon={faBell} size={30} color="#183A36" />
                        <Text style={styles.menuText}>Meldingen</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/pet")}>
                    <View style={styles.leftSection}>
                        <FontAwesomeIcon icon={faPaw} size={30} color="#183A36" />
                        <Text style={styles.menuText}>Pas je huisdier aan</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>
            </View>


            {/* Afmelden & Account verwijderen */}
            <View style={styles.logoutSection}>
                <TouchableOpacity onPress={() => router.push("/signOut")}>
                    <Text style={styles.logoutText}>Afmelden</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => router.push("/account")}>
                    <Text style={styles.deleteText}>Account verwijderen</Text>
                </TouchableOpacity>
            </View>
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