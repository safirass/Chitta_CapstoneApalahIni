import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
Dimensions,
TouchableOpacity,
Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { rekomendasiDASS } from "../../data/rekomendasiDASS";

const screenWidth = Dimensions.get("window").width - 30;

const levelKeterangan = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
};

const getKategoriColor = (kategori) => {
switch (kategori) {
    case "Ringan":
    return "#2ECC71"; // hijau
    case "Sedang":
    return "#F1C40F"; // kuning
    case "Berat":
    return "#E67E22"; // oranye
    case "Sangat Berat":
    return "#E74C3C"; // merah
    default:
    return "#333";
}
};

export default function HasilPemantauanScreen() {
const route = useRoute();
const navigation = useNavigation();

const { data } = route.params || {};

// Pastikan data ada
if (!data) {
    return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tidak ada data</Text>
        <Text style={styles.text}>Data hasil pemantauan tidak tersedia.</Text>
        </View>
    </ScrollView>
    );
}

const barData = {
    labels: ["Depresi", "Kecemasan", "Stres"],
    datasets: [{ data: [data.Depresi ?? 0, data.Kecemasan ?? 0, data.Stres ?? 0] }],
};

const handleOpenLink = () => {
    Linking.openURL("https://linktr.ee/undip.studentcare");
};

return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
    {/* CARD HEADER */}
    <View style={styles.card}>
        <View style={styles.headerContainer}>

        <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Grafik Pemantauan</Text>
            <Text style={styles.subtitle}>Tanggal: {data.tanggal ?? "-"}</Text>
        </View>

        <View style={{ width: 24 }} />
        </View>

        {/* Grafik */}
        <BarChart
        data={barData}
        width={screenWidth}
        height={220}
        fromZero
        withInnerLines={false}
        yAxisInterval={1}
        yLabelsOffset={10}
        chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(83, 77, 217, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ borderRadius: 10 }}
        segments={4}
        />

        <Text style={styles.levelNote}>1 = Ringan | 2 = Sedang | 3 = Berat | 4 = Sangat Berat</Text>
    </View>

    {/* SECTION DEPRESI, KECEMASAN, STRES */}
    {["Depresi", "Kecemasan", "Stres"].map((domain) => {
        const level = data[domain]; // angka 1–4
        const kategori = levelKeterangan[level] || "-";
        // SAFELY akses data.detail (fallback jika tidak ada)
        const backend = data.detail?.[domain] || { keterangan: "Keterangan tidak tersedia dari backend.", skor: data[domain] ?? null };
        const rekom =
        rekomendasiDASS?.[domain]?.[kategori] || {
            gejala: "Data belum tersedia.",
            rekomendasi: "Silakan konsultasi dengan UPT LKDPDEM.",
        };

        return (
        <View key={domain} style={styles.section}>
            <Text style={styles.sectionTitle}>{domain}</Text>

            <Text style={styles.kategori}>
            Kategori:{" "}
            <Text style={[styles.kategoriText, { color: getKategoriColor(kategori) }]}>
                {kategori}
            </Text>
            </Text>

            {/* Keterangan dari BACKEND */}
            <Text style={styles.label}>Keterangan Tes:</Text>
            <Text style={styles.text}>{backend.keterangan}</Text>

            {/* Rekomendasi */}
            <Text style={styles.label}>Rekomendasi:</Text>
            <Text style={styles.text}>{rekom.rekomendasi}</Text>
        </View>
        );
    })}

    {/* QUOTE DAN LINK */}
    <View style={styles.section}>
        <Text style={styles.text}>
        "Kehidupan yang baik adalah sebuah proses, bukan suatu keadaan yang ada dengan sendirinya.
        Kehidupan itu sendiri adalah arah, bukan tujuan."
        </Text>
        <Text style={styles.author}>- Carl Rogers</Text>

        <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
        <Text style={styles.buttonText}>UNDIP STUDENT CARE</Text>
        </TouchableOpacity>

        <Text style={styles.cardDesc}>
        Klik tombol di atas untuk mendaftar konseling atau melihat layanan mahasiswa lainnya.
        </Text>
    </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#F3EFFF" },
scrollContainer: { padding: 15, paddingBottom: 40 },

card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
},

headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
},
backButton: {
    padding: 5,
    marginRight: 10,
},
headerTextContainer: {
    flex: 1,
    alignItems: "center",
},

title: { fontSize: 18, fontWeight: "bold", color: "#041062", textAlign: "center" },
subtitle: { fontSize: 14, color: "#666", marginBottom: 10, textAlign: "center" },
levelNote: { marginTop: 8, fontSize: 12, color: "#666", textAlign: "center" },

section: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
},
sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#041062" },
kategori: { fontWeight: "600", marginVertical: 5 },
kategoriText: { fontWeight: "bold" },
label: { fontWeight: "bold", marginTop: 8 },
text: { fontSize: 14, color: "#333", marginBottom: 4 },

author: {
    fontStyle: "italic",
    color: "#666",
    textAlign: "right",
    marginTop: 5,
},
button: {
    backgroundColor: "#534DD9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
},
buttonText: { color: "#fff", fontWeight: "bold" },
cardDesc: {
    marginTop: 6,
    fontSize: 12,
    color: "#444",
    textAlign: "center",
},
});