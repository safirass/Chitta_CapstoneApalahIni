import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Container from "../../components/container";
import Card from "../../components/card";

export default function AdminHomeScreen({ setIsLoggedIn, setUserRole, setUserData, userData}) {
const navigation = useNavigation();
const [greeting, setGreeting] = useState("");

useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi");
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
}, []);

const handleLogout = () => {
Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
    { text: "Batal", style: "cancel" },
    {
    text: "Ya, Logout",
    onPress: () => {
        setIsLoggedIn(false);
        setUserRole(null);  
        setUserData(null);  
    },
    style: "destructive",
    },
]);
};

const namaAdmin = userData?.nama || "Admin UNDIP";

return (
    <Container>
    {/* Header */}
    <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate("Profile Admin")}
    >
        <View>
        <Text style={styles.greeting}>{`${greeting},`}</Text>
        <Text style={styles.name}>{namaAdmin}</Text>
        </View>
    </TouchableOpacity>

    {/* Daftar Mahasiswa */}
    <TouchableOpacity onPress={() => navigation.navigate("Daftar Mahasiswa")}>
        <Card
        title="Daftar Mahasiswa"
        description="Lihat data lengkap semua mahasiswa dan detail monitoring mereka"
        />
    </TouchableOpacity>

    {/* Riwayat Pemantauan */}
    <TouchableOpacity onPress={() => navigation.navigate("Riwayat Pemantauan")}>
        <Card
        title="Riwayat Pemantauan Mahasiswa"
        description="Cek riwayat pemantauan kesehatan mental seluruh mahasiswa"
        />
    </TouchableOpacity>

    {/* Logout */}
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>→ Logout</Text>
    </TouchableOpacity>
    </Container>
);
}

const styles = StyleSheet.create({
header: { flexDirection: "row", alignItems: "center", marginBottom: 25, marginTop: 35 },
greeting: { fontSize: 15, color: "#666" },
name: { fontSize: 20, fontWeight: "bold", color: "#000" },
logoutButton: { marginTop: 30, alignSelf: "flex-end" },
logoutText: { color: "#FF3B30", fontWeight: "bold", fontSize: 16 },
});
