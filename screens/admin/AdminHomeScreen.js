import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
Image,
TouchableOpacity,
} from "react-native";

export default function AdminHomeScreen({ navigation }) {
// Contoh data (nanti bisa diganti dari API/backend)
const riwayatStres = []; // Kosong untuk contoh
const daftarMahasiswa = []; // Kosong juga untuk contoh

return (
    <ScrollView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
        <Image
        source={{
            uri: "https://i.pinimg.com/564x/22/1c/26/221c26b45a5a9bb79cc50da2b01a7b76.jpg",
        }}
        style={styles.avatar}
        />
        <View>
        <Text style={styles.greeting}>Selamat Pagi</Text>
        <Text style={styles.role}>Admin</Text>
        </View>
    </View>

    {/* Riwayat Stres Tinggi */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Riwayat Stres Tinggi</Text>

        <View style={styles.tableHeader}>
        <Text style={[styles.tableText, styles.bold]}>Nama</Text>
        <Text style={[styles.tableText, styles.bold]}>Tanggal</Text>
        </View>

        {riwayatStres.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada data riwayat stres tinggi</Text>
        ) : (
        riwayatStres.map((item, index) => (
            <View key={index} style={styles.tableRow}>
            <Text style={styles.tableText}>{item.nama}</Text>
            <Text style={styles.tableText}>{item.tanggal}</Text>
            </View>
        ))
        )}

        <TouchableOpacity
        style={styles.moreButton}
        onPress={() => navigation.navigate("RiwayatStres")}
        >
        <Text style={styles.moreText}>Lebih banyak ➜</Text>
        </TouchableOpacity>
    </View>

    {/* Daftar Mahasiswa */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Daftar Mahasiswa</Text>

        <View style={styles.tableHeader}>
        <Text style={[styles.tableText, styles.bold]}>Nama</Text>
        <Text style={[styles.tableText, styles.bold]}>Semester</Text>
        </View>

        {daftarMahasiswa.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada data mahasiswa</Text>
        ) : (
        daftarMahasiswa.map((item, index) => (
            <View key={index} style={styles.tableRow}>
            <Text style={styles.tableText}>{item.nama}</Text>
            <Text style={styles.tableText}>{item.semester}</Text>
            </View>
        ))
        )}

        <TouchableOpacity
        style={styles.moreButton}
        onPress={() => navigation.navigate("DaftarMahasiswa")}
        >
        <Text style={styles.moreText}>Lebih banyak ➜</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingTop: 40,
},
header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#EAE6FF",
    borderRadius: 12,
    padding: 12,
},
avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
},
greeting: {
    fontSize: 16,
    color: "#000",
},
role: {
    fontSize: 14,
    color: "#555",
},
card: {
    backgroundColor: "#F8F7FF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
},
cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
},
tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
    marginBottom: 6,
},
tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
},
tableText: {
    color: "#333",
    fontSize: 14,
},
bold: {
    fontWeight: "bold",
},
moreButton: {
    marginTop: 8,
    alignSelf: "flex-end",
},
moreText: {
    color: "#777",
    fontSize: 13,
},
emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
},
});
