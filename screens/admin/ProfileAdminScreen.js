
import { useState } from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native"
import Container from "../../components/container"
import Card from "../../components/card"

const ProfileAdminScreen = ({ navigation, setIsLoggedIn }) => {
const [profileData] = useState({
    nama: "Dr. Admin Undip",
    nip: "1234567890123456", 
})
const handleLogout = () => {
    Alert.alert(
    "Konfirmasi Logout",
    "Apakah Anda yakin ingin keluar dari akun ini?",
    [
        {
        text: "Batal",
        style: "cancel",
        },
        {
        text: "Ya, Logout",
        onPress: () => {
            setIsLoggedIn(false)
        },
        style: "destructive",
        },
    ],
    { cancelable: true }
    )
}
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
)
}

const styles = StyleSheet.create({
profileContainer: { alignItems: "center", marginBottom: 20 },
infoContainer: { marginBottom: 20 },
label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
value: { fontSize: 16, marginBottom: 10, color: "#555" },
logoutButton: { alignItems: "flex-end" },
logoutText: { fontSize: 16, color: "#007AFF" },
})

export default ProfileAdminScreen
