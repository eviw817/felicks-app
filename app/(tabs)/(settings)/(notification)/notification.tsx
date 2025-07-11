import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BaseText from "@/components/BaseText";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavigationBar";

const NotificatiesScreen = () => {
    const router = useRouter();
 // States voor de toggles
 const [pushNotificaties, setPushNotificaties] = useState(false);
 const [emailMeldingen, setEmailMeldingen] = useState(false);
 const [geluidToestemming, setGeluidToestemming] = useState(false);
 const [cameraToestemming, setCameraToestemming] = useState(false);

 const fetchUserSettings = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        Alert.alert("Fout", "Kan sessie niet ophalen.");
        return;
    }

    if (!session || !session.user?.id) {
        Alert.alert("Fout", "Geen gebruiker ingelogd.");
        return;
    }

    const userId = session.user.id;

    // Haal de gebruikersinstellingen op uit Supabase
    const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single(); // We verwachten maar 1 rij terug te krijgen

    if (error && error.code === 'PGRST116') {
        await createDefaultSettings(userId);
    } else if (error) {
        Alert.alert("Fout", "Er is een probleem opgetreden bij het ophalen van je instellingen.");
    } else {
        // Stel de voorkeuren in op basis van de gegevens
        setPushNotificaties(data.push_notifications);
        setEmailMeldingen(data.email_notifications);
        setGeluidToestemming(data.sound_permission);
        setCameraToestemming(data.camera_permission);
    }
};

const createDefaultSettings = async (userId: string) => {
    try {
        // Controleer of de gebruiker al instellingen heeft
        const { data, error } = await supabase
            .from('user_settings')
            .select("*")
            .eq('user_id', userId)
            .single();

        if (data) {
            return;
        }

        // Voeg standaardinstellingen toe als ze niet bestaan
        const { data: newData, error: createError } = await supabase
            .from('user_settings')
            .insert([{
                user_id: userId,
                push_notifications: false,
                email_notifications: false,
                sound_permission: false,
                camera_permission: false
            }]);

        if (createError) {
            Alert.alert("Fout", `Er is een probleem opgetreden bij het aanmaken van standaardinstellingen: ${createError.message}`);
        } else {
            fetchUserSettings();
        }
    } catch (error) {
        Alert.alert("Fout", "Er is een probleem opgetreden bij het aanmaken van standaardinstellingen.");
    }
};


const saveUserSettings = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        Alert.alert("Fout", "Kan sessie niet ophalen.");
        return;
    }

    if (!session || !session.user?.id) {
        Alert.alert("Fout", "Geen gebruiker ingelogd.");
        return;
    }

    const userId = session.user.id;

    // Update de gebruikersinstellingen in de database
    const { data, error } = await supabase
        .from("user_settings")
        .update({
            push_notifications: pushNotificaties,
            email_notifications: emailMeldingen,
            sound_permission: geluidToestemming,
            camera_permission: cameraToestemming,
        })
        .eq("user_id", userId); // Zorg ervoor dat de update specifiek is voor deze gebruiker

    if (error) {
        Alert.alert("Fout", "Er is een probleem opgetreden bij het opslaan van de instellingen.");
    } else {
        Alert.alert("Instellingen opgeslagen", "Je voorkeuren zijn succesvol opgeslagen.");
        fetchUserSettings();
    }
};



useEffect(() => {
    fetchUserSettings();
}, []);  // Dit wordt slechts één keer uitgevoerd als de component wordt geladen


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/settings")}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
                </TouchableOpacity>
                <BaseText style={styles.title}>Meldingen en toestemmingen</BaseText>
            </View>

            {/* Meldingen */}
            <Text style={styles.sectionTitle}>Meldingen</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Push berichten</Text>
                <Switch
                    value={pushNotificaties}
                    onValueChange={setPushNotificaties}
                    thumbColor={pushNotificaties ? "#ECECEB" : "#f4f3f4"}
                    trackColor={{ false: "#ccc", true: "#97B8A5" }}
                    style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>E-mailmeldingen</Text>
                <Switch
                    value={emailMeldingen}
                    onValueChange={setEmailMeldingen}
                    thumbColor={emailMeldingen ? "#ECECEB" : "#f4f3f4"}
                    trackColor={{ false: "#ccc", true: "#97B8A5" }}
                    style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                />
            </View>

            {/* Toestemmingen */}
            <Text style={styles.sectionTitle}>Toestemmingen</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Geluid</Text>
                <Switch
                    value={geluidToestemming}
                    onValueChange={setGeluidToestemming}
                    thumbColor={geluidToestemming ? "#ECECEB" : "#f4f3f4"}
                    trackColor={{ false: "#ccc", true: "#97B8A5" }}
                    style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Camera</Text>
                <Switch
                    value={cameraToestemming}
                    onValueChange={setCameraToestemming}
                    thumbColor={cameraToestemming ? "#ECECEB" : "#f4f3f4"}
                    trackColor={{ false: "#ccc", true: "#97B8A5" }}
                    style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                />
            </View>

            {/* Opslaan knop */}
            <TouchableOpacity style={styles.button} onPress={saveUserSettings}>
                <Text style={styles.buttonText}>OPSLAAN</Text>
            </TouchableOpacity>
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
        backgroundColor: "#FFFDF9",
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start", 
        width: "100%",
        paddingVertical: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontFamily: 'SireniaMedium',
        textAlign: "center",

        marginLeft: 15, 
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#183A36",
        marginTop: 20,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    label: {
        fontSize: 16,
        color: "#183A36",
    },
    button: {
        backgroundColor: "#97B8A5",
        paddingVertical: 15,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 40
    },
    buttonText: {
        color: "#183A36",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default NotificatiesScreen;
