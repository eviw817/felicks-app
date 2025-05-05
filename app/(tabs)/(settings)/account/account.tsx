import React, { useState }from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../../../lib/supabase";

const DeleteScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        console.log("Verwijder account aangeroepen");

        try {
            setLoading(true);

            // Haal de sessie op
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session?.user?.id) {
                Alert.alert("Fout", "Kan sessie of gebruiker niet ophalen.");
                return;
            }

            const userId = session.user.id;

            // Call the Supabase Edge Function to delete the user
            const response = await supabase.functions.invoke('delete-user', {
                body: JSON.stringify({ userId }),
            });

            // Log de raw response text
            if (response.error) {
                console.error("Error from Supabase function:", response.error.message);
                Alert.alert("Fout", "Er is iets misgegaan bij het verwijderen van je account.");
                return;
            }

            const responseBody = response.data;
            console.log("Response body:", responseBody);

            // Controleer of de aanroep succesvol was
            if (responseBody?.message === 'User deleted successfully') {
                // Uitloggen en navigeren
                await supabase.auth.signOut();
                router.push("/");

                Alert.alert("Account verwijderd", "Je account is succesvol verwijderd.");
            } else {
                Alert.alert("Fout", "Er is iets misgegaan bij het verwijderen van je account.");
            }
        } catch (error) {
            console.log("Fout bij verwijderen:", error);
            Alert.alert("Fout", "Er is iets misgegaan.");
        } finally {
            setLoading(false);
        }
    };

      
    return (
        <View style={styles.container}>
            {/* Header met terugknop */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("../settings")}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
                </TouchableOpacity>
                <Text style={styles.title}>Account verwijderen</Text>
            </View>

            {/* Tekst */}
            <Text style={styles.goodbyeText}>Het is heel spijtig dat wij een dierenvriend
            als u moeten kwijt spelen. Hopelijk zien we u binnenkort snel terug!</Text>
            <Text style={styles.confirmText}>Bent u zeker dat u uw account wilt 
            verwijderen?</Text>

            {/* Knoppen */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("../settings")}>
                <Text style={styles.buttonText}>NEE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
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
        textAlign: "center",
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
        width: "90%",
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#183A36",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DeleteScreen;
