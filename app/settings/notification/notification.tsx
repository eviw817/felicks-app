import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const NotificatiesScreen = () => {
    const router = useRouter();
    
    // States voor de toggles
    const [pushNotificaties, setPushNotificaties] = useState(false);
    const [emailMeldingen, setEmailMeldingen] = useState(false);
    const [geluidToestemming, setGeluidToestemming] = useState(false);
    const [cameraToestemming, setCameraToestemming] = useState(false);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/settings/settings")}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} color="#183A36" />
                </TouchableOpacity>
                <Text style={styles.title}>Meldingen en toestemmingen</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFDF9",
        padding: 20,
        paddingTop: 100,
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
        fontSize: 23,
        fontWeight: "bold",
        color: "#183A36",
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
});

export default NotificatiesScreen;
