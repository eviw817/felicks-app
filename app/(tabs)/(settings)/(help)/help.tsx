import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
// import { supabase } from "../../lib/supabase";
// import { Session } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "@/components/NavigationBar";
import BaseText from "@/components/BaseText";

const HelpScreen = () => {
      const router = useRouter();
  
    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/settings")} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color={'#183A36'} style={styles.backButton} />
                </TouchableOpacity>
                <BaseText style={styles.title}>Hulp</BaseText>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/problem")}>
                    <View style={styles.leftSection}>
                        <Text style={styles.menuText}>Probleem rapporteren</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/helpCentrum")}>
                    <View style={styles.leftSection}>
                        <Text style={styles.menuText}>Helpcentrum</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={25} color="#183A36" />
                </TouchableOpacity>
            </View>
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
  });
  
  export default HelpScreen;