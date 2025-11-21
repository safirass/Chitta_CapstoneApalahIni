import React, { useState } from "react";
import {
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Image,
Alert,
KeyboardAvoidingView,
Platform,
ScrollView,
ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function LoginScreen({ navigation, setIsLoggedIn, setUserRole, setUserData }) {
const [id, setId] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const API_BASE_URL = "http://10.0.2.2:8000/api";


const dummyUsers = [
    {
    id: "1", //nim 
    password: "1",
    nama: "Safira Septiandika Salsabila",
    role: "user",
    },
    {
    id: "2", //nip
    password: "2",
    nama: "Admin UPT LKDPDEM",
    role: "admin",
    },
];

const handleLogin = async () => {
    if (!id || !password) {
    Alert.alert("Peringatan", "Silakan isi NIM/NIP dan Password terlebih dahulu!");
    return;
    }
//ini nanti apus aja kalau backend udah jalan
    const user = dummyUsers.find((u) => u.id === id && u.password === password);

    if (user) {
    Alert.alert("Login Berhasil", `Selamat datang, ${user.nama}`);
    setIsLoggedIn(true);
    setUserRole(user.role);
    setUserData(user);
    return; //dummy
    }


    setLoading(true);
    try {
    const payload =
        id.length > 5
        ? { nim: id, password } // mahasiswa
        : { nip: id, password }; // admin

    const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);

    const { data } = res.data;
    Alert.alert("Berhasil", `Selamat datang, ${data.nama}!`);

    setIsLoggedIn(true);
    setUserRole(data.role || "user");
    setUserData({
        id: data.nim || data.nip,
        nama: data.nama,
        role: data.role,
        token: data.token || null,
    });

    navigation.replace("Home");
    } catch (error) {
    Alert.alert("Login Gagal", "Tidak dapat terhubung ke server backend.");
    console.log("⚠️ Error Login:", error.message);
    } finally {
    setLoading(false);
    }
};

return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
    >
        {/* Logo */}
        <Image
        source={require("../../assets/chitta.png")}
        style={styles.logo}
        resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>LOG IN</Text>
        <Text style={styles.subtitle}>
        Masukkan NIM (Mahasiswa) atau NIP (Admin) dan Password untuk melanjutkan.
        </Text>

        {/* Input NIM/NIP */}
        <TextInput
        style={styles.input}
        placeholder="Masukkan NIM / NIP"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
        />

        {/* Input Password */}
        <TextInput
        style={styles.input}
        placeholder="Masukkan Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        />

        {/* Lupa Password */}
        <Text
        style={styles.forgot}
        onPress={() => navigation.navigate("ForgotPassword")}
        >
        Lupa Password?
        </Text>

        {/* Tombol Login */}
        {loading ? (
        <ActivityIndicator
            size="large"
            color="#534DD9"
            style={{ marginVertical: 20 }}
        />
        ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        )}

        {/* Link ke Register */}
        <Text style={styles.footer}>
        Belum memiliki akun?{" "}
        <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
        >
            Daftar di sini
        </Text>
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
logo: { width: 120, height: 120, marginBottom: 20 },
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
    color: "#000",
    marginBottom: 20,
},
input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
},
forgot: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 15,
    color: "#5A67D8",
    fontSize: 13,
},
button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
},
buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
footer: { fontSize: 14, color: "#000" },
link: { color: "#5A67D8", fontWeight: "500" },
});
