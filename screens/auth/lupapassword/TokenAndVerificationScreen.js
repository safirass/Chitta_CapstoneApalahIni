import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import Container from "../../../components/container";
import API from "../../../data/MahasiswaDummy";

export default function TokenAndResetPasswordScreen({ navigation, route }) {
    const [token, setToken] = useState("");
    const [generatedToken] = useState("123456"); // token dummy
    const [remainingTime, setRemainingTime] = useState(1800); // 30 menit
    const [isVerified, setIsVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { nim } = route.params || {};

    // Hitung mundur waktu token
    useEffect(() => {
        if (remainingTime <= 0) return;
        const timer = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [remainingTime]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleVerify = () => {
        if (remainingTime <= 0) {
            Alert.alert(
                "Token Kadaluarsa",
                "Waktu verifikasi telah habis. Silakan kembali untuk meminta token baru."
            );
            return;
        }

        if (token === generatedToken) {
            Alert.alert("Sukses", "Token berhasil diverifikasi!");
            setIsVerified(true);
        } else {
            Alert.alert("Error", "Token salah atau tidak valid!");
        }
    };

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Semua kolom harus diisi!");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Konfirmasi password tidak cocok!");
            return;
        }

        try {
            const mahasiswa = await API.getMahasiswaByNIM(nim);
            if (!mahasiswa) {
                Alert.alert("Gagal", "Akun dengan NIM tersebut tidak ditemukan!");
                return;
            }

            mahasiswa.password = newPassword;
            Alert.alert("Sukses", "Password berhasil direset!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", "Terjadi kesalahan saat mereset password.");
        }
    };

    return (
        <Container>
            <View style={styles.wrapper}>
                {/* Bagian Input Token */}
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Masukkan token yang telah dikirim ke email Anda, lalu atur password baru.
                </Text>

                <View style={styles.tokenRow}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                        placeholder="Masukkan Token"
                        value={token}
                        onChangeText={setToken}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={[styles.button, { paddingHorizontal: 16 }]}
                        onPress={handleVerify}
                    >
                        <Text style={styles.buttonText}>Verif</Text>
                    </TouchableOpacity>
                </View>

                {remainingTime > 0 ? (
                    <Text style={styles.timerText}>
                        Token berlaku selama{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            {formatTime(remainingTime)}
                        </Text>
                    </Text>
                ) : (
                    <Text style={[styles.timerText, { color: "red" }]}>
                        Token kadaluarsa. Silakan minta ulang token.
                    </Text>
                )}

                {/* Bagian Password Baru */}
                <TextInput
                    style={styles.input}
                    placeholder="Password Baru"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Konfirmasi Password Baru"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity
                    style={[styles.button, { width: "100%", marginTop: 10 }]}
                    onPress={handleReset}
                >
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>

            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2E2A5C",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        textAlign: "center",
        color: "#555",
        marginBottom: 20,
    },
    tokenRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#5A67D8",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    timerText: {
        fontSize: 13,
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    footerLink: {
        color: "#5A67D8",
        textAlign: "center",
        marginTop: 15,
        fontSize: 14,
    },
});
