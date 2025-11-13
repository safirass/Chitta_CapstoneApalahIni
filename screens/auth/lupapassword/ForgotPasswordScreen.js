import { useState } from "react";
import {
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
KeyboardAvoidingView,
Platform,
ScrollView,
} from "react-native";
import API from "../../../data/MahasiswaDummy"; // import API dummy

export default function ForgotPasswordScreen({ navigation }) {
const [nim, setNim] = useState("");

const handleNext = async () => {
    if (!nim) {
    Alert.alert("Peringatan", "Silakan masukkan NIM Anda!");
    return;
    }

    try {
    // Ambil data mahasiswa berdasarkan NIM
    const mahasiswa = await API.getMahasiswaByNIM(nim);

    // Kalau berhasil ditemukan
    Alert.alert(
        "Berhasil",
        `Token berhasil dikirim ke email ${mahasiswa.email}`
    );

    // Lanjut ke halaman TokenVerification sambil bawa data nim
    navigation.navigate("TokenAndVerification", { nim });
    } catch (error) {
    // Kalau NIM tidak ditemukan
    Alert.alert("Gagal", "Tidak ada akun yang terdaftar dengan NIM tersebut.");
    }
};

return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>LUPA PASSWORD</Text>
        <Text style={styles.subtitle}>
        Masukkan NIM Anda untuk menerima token verifikasi.
        </Text>

        <TextInput
        style={styles.input}
        placeholder="Masukkan NIM"
        value={nim}
        onChangeText={setNim}
        keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>KIRIM TOKEN</Text>
        </TouchableOpacity>

        <Text
        style={styles.footer}
        onPress={() => navigation.navigate("Login")}
        >
        Kembali ke Log in
        </Text>
    </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FE",
    padding: 20,
},
title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
},
subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#000",
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
    marginBottom: 15,
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
    color: "#5A67D8",
},
});
