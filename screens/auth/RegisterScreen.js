import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";

export default function RegisterScreen({ navigation }) {
const [email, setEmail] = useState("");

const handleRegister = () => {
    if (email.trim() === "") {
    Alert.alert("Peringatan", "Email SSO tidak boleh kosong!");
    } else {
    // Dummy response (belum ada backend)
    Alert.alert("Sukses", `Akun dengan email ${email} berhasil didaftarkan!`);
    console.log("Email SSO:", email);
    // Arahkan ke halaman Login (dummy)
    navigation.navigate("Login");
    }
};

return (
    <View style={styles.container}>
    {/* Logo */}
    <Image
        source={require('../../assets/chitta.png')}      
        style={styles.logo}
        resizeMode="contain"
    />

    {/* Title */}
    <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
    <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum
        aliquam facilisis. Nullam tempus diam sed nisl consectetur cursus.
    </Text>

    {/* Input Email */}
    <Text style={styles.label}>Email SSO</Text>
    <TextInput
        style={styles.input}
        placeholder="Masukkan Email SSO"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
    />

    {/* Tombol Daftar */}
    <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>DAFTAR</Text>
    </TouchableOpacity>

    {/* Link ke Login */}
    <Text style={styles.footer}>
        Sudah memiliki akun?{" "}
        <Text
        style={styles.link}
        onPress={() => navigation.navigate("Login")}
        >
        Login di sini
        </Text>
    </Text>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FE",
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 13,
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
    },
    label: {
        alignSelf: "flex-start",
        marginLeft: 30,
        marginBottom: 5,
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#5A67D8",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        elevation: 3,
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    footer: {
        fontSize: 14,
        color: "#333",
    },
    link: {
        color: "#5A67D8",
        fontWeight: "500",
    },
});
