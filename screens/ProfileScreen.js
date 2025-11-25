import React, { useEffect, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../components/container";
import Card from "../components/card";

const API_BASE_URL = "http://10.0.2.2:8000/api";

export default function ProfileScreen(props) {
const navigation = useNavigation();
const route = useRoute();

// accept userData from props OR route params
const incomingUserData = props.userData || route.params?.userData || null;
const { setIsLoggedIn, setUserRole, setUserData } = props;

const [profileData, setProfileData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchProfile = async () => {
    setLoading(true);

    // If no incoming user data, fallback to dummy
    if (!incomingUserData) {
        setProfileData(getDummyProfile(null));
        setLoading(false);
        return;
    }

    // If token available, prefer calling /auth/me (adjust endpoint)
    try {
        if (incomingUserData.token) {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${incomingUserData.token}` },
        });
        // Try common shapes: res.data.data or res.data
        const pd = res?.data?.data || res?.data;
        if (pd) {
            setProfileData(normalizeProfile(pd, incomingUserData));
            setLoading(false);
            return;
        }
        }

        // If no token or /auth/me failed, try GET by nim (mahasiswa)
        const nim = incomingUserData.nim || incomingUserData.id;
        if (nim && String(nim).length > 5) {
        const res = await axios.get(`${API_BASE_URL}/mahasiswa/${nim}`);
        const pd = res?.data?.data || res?.data;
        if (pd) {
            setProfileData(normalizeProfile(pd, incomingUserData));
            setLoading(false);
            return;
        }
        }

        // fallback: use incomingUserData as profile
        setProfileData(getDummyProfile(incomingUserData));
    } catch (error) {
        console.warn("Gagal ambil profil dari backend:", error?.message || error);
        // fallback to incoming or dummy
        setProfileData(getDummyProfile(incomingUserData));
    } finally {
        setLoading(false);
    }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [incomingUserData]);

const normalizeProfile = (pd, incoming) => {
    // Normalize various backend shapes into our UI shape
    return {
    nama: pd.nama || pd.name || incoming?.nama || "Warga Undip",
    nim: pd.nim || pd.nip || incoming?.nim || incoming?.id || "",
    jurusan: pd.jurusan || pd.prodi || pd.department || "—",
    fakultas: pd.fakultas || pd.faculty || "—",
    semester: pd.semester || pd.kelas || "—",
    jenisKelamin: pd.jenis_kelamin || pd.gender || "—",
    whatsapp: pd.whatsapp || pd.hp || pd.phone || "—",
    foto: pd.foto || pd.avatar || incoming?.foto || null,
    };
};

const getDummyProfile = (incoming) => ({
    nama: incoming?.nama || "Bagas",
    nim: incoming?.nim || incoming?.id || "21120122140119",
    jurusan: "Teknik Komputer",
    fakultas: "Teknik",
    semester: "7",
    jenisKelamin: "Laki-laki",
    whatsapp: incoming?.whatsapp || "628123456789",
    foto: incoming?.foto || null,
});

const handleLogout = () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
    { text: "Batal", style: "cancel" },
    {
        text: "Ya, Logout",
        onPress: () => {
        if (typeof setIsLoggedIn === "function") setIsLoggedIn(false);
        if (typeof setUserRole === "function") setUserRole(null);
        if (typeof setUserData === "function") setUserData(null);
        // navigate to Login (replace stack)
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
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
        <Text style={{ textAlign: "center", marginTop: 50 }}>Gagal memuat data profil.</Text>
    </Container>
    );
}

return (
    <Container>
    <Card type="info">
        <View style={styles.profileContainer}>
        <Image
            style={styles.profileImage}
            source={profileData.foto ? { uri: profileData.foto } : require("../assets/chitta.png")}
        />
        </View>

        <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{profileData.nama}</Text>

        <Text style={styles.label}>NIM / NIP</Text>
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