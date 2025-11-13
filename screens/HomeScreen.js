import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Image,
ScrollView,
Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../components/container";
import Card from "../components/card";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
const navigation = useNavigation();
const route = useRoute();

// Ambil data user dari login
const { userData } = route.params || { userData: { nama: "WARGA UNDIP" } };

const [greeting, setGreeting] = useState("");

useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi");
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
}, []);

const namaUser = userData?.nama || "Warga UNDIP";
const fotoUser = userData?.foto || null;

return (
    <Container>
    <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate("Profile", { userData })}
        >
        <Image
            style={styles.avatar}
            source={
            fotoUser
                ? { uri: fotoUser }
                : require("../assets/chitta.png")
            }
        />
        <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>{namaUser}</Text>
        </View>
        </TouchableOpacity>

        {/* Chat AI */}
        <Card
        title="Mulai Mengobrol dengan Chat AI"
        description="Asisten AI kami siap menemanimu berbagi cerita dan memberikan saran."
        type="info"
        >
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Konsultasi", { userData })}
        >
            <Text style={styles.buttonText}>Mulai Konsultasi</Text>
        </TouchableOpacity>
        </Card>

        {/* === CARD FITUR === */}
        <Card
        title="Fitur Kesehatan Mental"
        description="Gunakan berbagai fitur untuk mendukung kesehatan mentalmu."
        >
        <View style={styles.featureGrid}>
            {/* Kesadaran Penuh */}
            <FeatureButton
            icon="meditation"
            label="Kesadaran Penuh"
            color="#4C51BF"
            onPress={() =>
                navigation.navigate("Kesadaran Penuh", { userData })
            }
            />

            {/* Pemantauan Stres */}
            <FeatureButton
            icon="brain"
            label="Pemantauan Stres"
            color="#DD6B20"
            onPress={() =>
                navigation.navigate("Pemantauan Stres", { userData })
            }
            />

            {/* Pelacakan Tidur */}
            <FeatureButton
            icon="sleep"
            label="Pelacakan Tidur"
            color="#3182CE"
            onPress={() =>
                navigation.navigate("Pelacakan Tidur", { userData })
            }
            />

            {/* Pemantauan Mahasiswa */}
            <FeatureButton
            icon="clipboard-text"
            label="Pemantauan Mahasiswa"
            color="#38A169"
            onPress={() =>
                navigation.navigate("Pemantauan Mahasiswa", { userData })
            }
            />
        </View>
        </Card>

        {/* Info UPT LKDPDEM */}
        <Card
        title="UPT LKDPDEM"
        description="[UPT Layanan Konsultasi, Disabilitas, Penegakan Disiplin, dan Etika Mahasiswa UNDIP]"
        >
        <Text style={styles.cardDesc}>Hotline: 0811-2500-5757</Text>
        <Text style={styles.cardDesc}>Email: upt.yanmas@undip.ac.id</Text>
        <TouchableOpacity
            style={styles.button}
            onPress={() =>
            Linking.openURL("https://linktr.ee/undip.studentcare")
            }
        >
            <Text style={styles.buttonText}>UNDIP STUDENT CARE</Text>
        </TouchableOpacity>
        <Text style={styles.cardDesc}>
            Klik tombol di atas untuk mendaftar konseling atau melihat layanan
            mahasiswa lainnya.
        </Text>
        </Card>
    </ScrollView>
    </Container>
);
}

/* Komponen tombol fitur */
const FeatureButton = ({ icon, label, color, onPress }) => (
<TouchableOpacity style={styles.featureButton} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
    <Icon name={icon} size={28} color="#fff" />
    </View>
    <Text style={styles.featureLabel}>{label}</Text>
</TouchableOpacity>
);

const styles = StyleSheet.create({
header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 35,
},
avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "#fff",
},
greeting: {
    fontSize: 15,
    color: "#000",
},
name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
},
button: {
    backgroundColor: "#534DD9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
},
cardDesc: {
    fontSize: 13,
    color: "#000",
    marginTop: 5,
},
featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
},
featureButton: {
    width: "47%",
    backgroundColor: "#F8F9FE",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
},
iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
},
featureLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
},
});
