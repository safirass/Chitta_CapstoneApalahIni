// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
const navigation = useNavigation();

return (
    <ScrollView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Image style={styles.avatar}
        source={require('../assets/tidur.png')} 
        />
        <View>
        <Text style={styles.greeting}>Selamat Pagi</Text>
        <Text style={styles.name}>Luffy</Text> 
        </View>
        </TouchableOpacity>
    </View>

    {/* Chat AI */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Mulai Mengobrol dengan Chat AI</Text>
        <Text style={styles.cardDesc}>
            Asisten AI kami yang akan selalu menemanimu
        </Text>
        <TouchableOpacity style={styles.button} onAccessibilityAction={() => navigation.navigate("Konsultasi")}>
            <Text style={styles.buttonText}>Mengobrol dengan Chat AI</Text>
        </TouchableOpacity>
    </View>

    {/* Kesadaran Penuh */}
    <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Kesadaran Penuh")}
    >
        <Text style={styles.cardTitle}>Kesadaran Penuh</Text>
        <Text style={styles.cardDesc}>
        Ruang untuk kamu fokus, menulis jurnal dan merasakan ketenangan
        </Text>
    </TouchableOpacity>

    {/* Pemantauan Tingkat Stres */}
    <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Pemantauan Stres")}
    >
        <Text style={styles.cardTitle}>Pemantauan Tingkat Stres</Text>
        <Text style={styles.cardDesc}>Pantau Level Stres Kamu</Text>
    </TouchableOpacity>

    {/* Pelacakan Tidur */}
    <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Pelacakan Tidur")}
    >
        <Text style={styles.cardTitle}>Pelacakan Tidur</Text>
        <Text style={styles.cardDesc}>Pantau durasi dan kualitas tidurmu</Text>
    </TouchableOpacity>

    {/* Pemantauan Mahasiswa */}
    <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Pemantauan Mahasiswa")}
    >
        <Text style={styles.cardTitle}>Pemantauan Mahasiswa</Text>
        <Text style={styles.cardDesc}>
        Tempat kamu mendeteksi gangguan kesehatan mental (kecemasan, depresi
        dan stres)
        </Text>
    </TouchableOpacity>

    {/* Info UPT */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>UPT LKDPDEM</Text>
        <Text style={styles.cardDesc}>
        [UPT Layanan Konsultasi, Disabilitas, Penegakan Disiplin, dan Etika
        Mahasiswa UNDIP]
        </Text>
        <Text style={styles.cardDesc}>Hotline: 0811-2500-5757</Text>
        <Text style={styles.cardDesc}>Email: upt.yanmas@undip.id</Text>
        <Text style={styles.cardDesc}>linktr.ee/undip.studentcare</Text>
    </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#F3EFFF",
    padding: 15,
    marginTop: 25,
},
header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
},
avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
},
greeting: {
    fontSize: 14,
    color: "#555",
},
name: {
    fontSize: 18,
    fontWeight: "bold",
},
card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
},
cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
},
cardDesc: {
    fontSize: 13,
    color: "#555",
},
button: {
    backgroundColor: "#7A5AF5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
},
});
