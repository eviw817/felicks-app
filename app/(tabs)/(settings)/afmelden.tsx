import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../../lib/supabase";

const AfmeldenScreen = () => {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();

            router.push("/");

        } catch (error) {
            Alert.alert("Fout", "Er is een fout opgetreden bij het afmelden.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header met terugknop */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("../settings")}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
                </TouchableOpacity>
                <Text style={styles.title}>Afmelden</Text>
            </View>

            {/* Tekst */}
            <Text style={styles.goodbyeText}>Tot de volgende keer!{"\n"}We zullen je missen.</Text>
            <Text style={styles.confirmText}>Ben je zeker dat je zich wilt afmelden?</Text>

            {/* Knoppen */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("../settings")}>
                <Text style={styles.buttonText}>NEE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nobutton} onPress={handleLogout}>
                <Text style={styles.buttonText}>JA</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: "#FFFDF9",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 80,
        left: 40,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: 30,
    },
    title: {
        flex: 1, 
        fontSize: 23,
        fontWeight: "bold",
        color: '#183A36',
        textAlign: "center",
        alignSelf: "center",
        marginRight: 50, 
    },
    goodbyeText: {
        fontSize: 20,
        fontWeight: "semibold",
        textAlign: "left",
        color: "#183A36",
        marginBottom: 20,
    },
    confirmText: {
        fontSize: 16,
        color: "#183A36",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#97B8A5",
        paddingVertical: 15,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#183A36",
        fontSize: 16,
        fontWeight: "bold",
    },
    nobutton: {
        borderWidth: 2,
        borderColor: "#97B8A5",  
        backgroundColor: "transparent",
        paddingVertical: 15,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
      }
});

export default AfmeldenScreen;
