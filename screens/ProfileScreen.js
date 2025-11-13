import React, { use, useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
Image,
TouchableOpacity,
Alert,
ActivityIndicator,
} from "react-native";
import axios from "axios";
import Container from "../components/container";
import Card from "../components/card";

const API_BASE_URL = "http://10.0.2.2:8000/api";

export default function ProfileScreen({ navigation, route, setIsLoggedIn }) {
const { userData } = route.params || {}; // Data login dikirim dari LoginScreen
const [profileData, setProfileData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    setProfileData({
    nama: userData?.nama || "Warga Undip",
    nim: userData?.nim || "21120122140000",
    jurusan: "Teknik Komputer",
    fakultas: "Teknik",
    semester: "7",
    jenisKelamin: "Perempuan",
    whatsapp: "628123456789",
    foto: null,
    });
    setLoading(false);
}, [userData]);
// ini kalo dah konek ke db aktifin aja
// useEffect(() => {
//     const fetchProfile = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/mahasiswa/${userData?.nim}`);
//         setProfileData(response.data.data);
//     } catch (error) {
//         console.log("⚠️ Gagal ambil profil dari backend:", error.message);
//         // fallback dummy
//         setProfileData({
//         nama: userData?.nama || "Warga Undip",
//         nim: userData?.nim || "21120122140000",
//         jurusan: "Teknik Komputer",
//         fakultas: "Teknik",
//         semester: "7",
//         jenisKelamin: "Perempuan",
//         whatsapp: "628123456789",
//         foto: null,
//         });
//     } finally {
//         setLoading(false);
//     }
//     };

//     fetchProfile();
// }, [userData]);

const handleLogout = () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
    { text: "Batal", style: "cancel" },
    {
        text: "Ya, Logout",
        onPress: () => {
        setIsLoggedIn(false);
        navigation.replace('Login');
        },
        style: "destructive",
    },
    ]);
};

if (loading) {
    return (
    <Container>
        <ActivityIndicator size="large" color="#534DD9" style={{ marginTop: 50 }} />
        <Text style={{ textAlign: "center", marginTop: 10, color: "#534DD9" }}>
        Memuat data profil...
        </Text>
    </Container>
    );
}

if (!profileData) {
    return (
    <Container>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
        Gagal memuat data profil.
        </Text>
    </Container>
    );
}

return (
    <Container>
    <Card type="info">
        <View style={styles.profileContainer}>
        <Image
            style={styles.profileImage}
            source={
            profileData.foto
                ? { uri: profileData.foto }
                : require("../assets/chitta.png")
            }
        />
        </View>

        <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{profileData.nama}</Text>

        <Text style={styles.label}>NIM</Text>
        <Text style={styles.value}>{profileData.nim}</Text>

        <Text style={styles.label}>Nomor WhatsApp</Text>
        <Text style={styles.value}>{profileData.whatsapp}</Text>

        <Text style={styles.label}>Jurusan</Text>
        <Text style={styles.value}>{profileData.jurusan}</Text>

        <Text style={styles.label}>Fakultas</Text>
        <Text style={styles.value}>{profileData.fakultas}</Text>

        <Text style={styles.label}>Semester</Text>
        <Text style={styles.value}>{profileData.semester}</Text>

        <Text style={styles.label}>Jenis Kelamin</Text>
        <Text style={styles.value}>{profileData.jenisKelamin}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>→ Logout</Text>
        </TouchableOpacity>
    </Card>
    </Container>
);
}

const styles = StyleSheet.create({
profileContainer: { alignItems: "center", marginBottom: 20 },
profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#534DD9",
    borderWidth: 4,
    backgroundColor: "#E9E8FF",
},
infoContainer: { marginBottom: 20 },
label: { fontSize: 15, fontWeight: "bold", marginBottom: 5, color: "#041062" },
value: { fontSize: 15, marginBottom: 10, color: "#6f6464ff" },
logoutButton: { alignItems: "flex-end" },
logoutText: { fontSize: 16, color: "#FF3B30", fontWeight: "bold" },
});
