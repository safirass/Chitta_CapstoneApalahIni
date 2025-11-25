import React, { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Image,
Alert,
KeyboardAvoidingView,
Platform,
ScrollView,
} from "react-native";

export default function RegisterScreen({ navigation }) {
const [email, setEmail] = useState("");

const handleRegister = () => {
    if (email.trim() === "") {
    Alert.alert("Peringatan", "Email SSO tidak boleh kosong!");
    } else {
    // Lanjut ke RegisterDetail untuk melengkapi data (UI tidak diubah)
    navigation.navigate("RegisterDetail", { email });
    }
};

return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require("../../assets/chitta.png")} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>BUAT AKUN</Text>
        <Text style={styles.subtitle}>Daftarkan dirimu untuk mulai menggunakan Chitta.</Text>

        <TextInput style={styles.input} placeholder="Masukkan Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>DAFTAR</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
        Sudah memiliki akun?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>Login di sini</Text>
        </Text>
    </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FE", padding: 20 },
logo: { width: 120, height: 120, marginBottom: 20 },
title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#000", textAlign: "center" },
subtitle: { fontSize: 13, textAlign: "center", color: "#666", marginBottom: 20 },
input: { width: "100%", borderWidth: 1, borderColor: "#5A67D8", borderRadius: 10, padding: 10, marginBottom: 20, backgroundColor: "#fff", color: "#000" },
button: { backgroundColor: "#5A67D8", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10, elevation: 3, marginBottom: 15 },
buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
footer: { fontSize: 14, color: "#333" },
link: { color: "#5A67D8", fontWeight: "500" },
});