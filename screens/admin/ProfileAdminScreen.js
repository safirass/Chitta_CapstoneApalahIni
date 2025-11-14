import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Alert,
ActivityIndicator,
} from "react-native";
import axios from "axios";
import Container from "../../components/container";
import Card from "../../components/card";

const API_BASE_URL = "http://10.0.2.2:8000/api";

export default function ProfileAdminScreen({ route, setIsLoggedIn ,setUserRole, setUserData }) {
const { userData } = route.params || {};

// const [profileData, setProfileData] = useState(null);
// const [loading, setLoading] = useState(true);

const [profileData, setProfileData] = useState({
    nama: "Admin UPT LKDPDEM",
    nip: "0000000000000000",
});


// useEffect(() => {
//     const fetchAdmin = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/admin/${userData?.nip}`);
//         setProfileData(response.data.data);
//     } catch (error) {
//         console.log("⚠️ Gagal ambil data admin:", error.message);
//         setProfileData({
//         nama: userData?.nama || "Admin UPT LKDPDEM",
//         nip: userData?.nip || "0000000000000000",
//         });
//     } finally {
//         setLoading(false);
//     }
//     };

//     fetchAdmin();
// }, [userData]);

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

// if (loading) {
//     return (
//     <Container>
//         <ActivityIndicator size="large" color="#534DD9" style={{ marginTop: 50 }} />
//         <Text style={{ textAlign: "center", marginTop: 10, color: "#534DD9" }}>
//         Memuat data profil admin...
//         </Text>
//     </Container>
//     );
// }

return (
    <Container>
    <Card type="info">
        <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{profileData.nama}</Text>

        <Text style={styles.label}>NIP</Text>
        <Text style={styles.value}>{profileData.nip}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>→ Logout</Text>
        </TouchableOpacity>
    </Card>
    </Container>
);
}

const styles = StyleSheet.create({
    infoContainer: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#041062" },
    value: { fontSize: 16, marginBottom: 10, color: "#555" },
    logoutButton: { alignItems: "flex-end" },
    logoutText: { fontSize: 16, color: "#FF3B30", fontWeight: "bold" },
});
