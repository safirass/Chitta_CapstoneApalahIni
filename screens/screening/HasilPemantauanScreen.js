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
import { Ionicons } from '@expo/vector-icons'; 

const rekomendasiDASS = {
Depresi: {
    Ringan: {
    gejala: "Merasa sedikit kehilangan minat, namun masih bisa beraktivitas.",
    rekomendasi: "Coba lakukan aktivitas positif seperti olahraga ringan atau journaling.",
    },
    Sedang: {
    gejala: "Mulai kehilangan motivasi dan mudah merasa lelah.",
    rekomendasi: "Cobalah berbicara dengan teman dekat atau konselor UPT.",
    },
    Berat: {
    gejala: "Kesulitan tidur, kehilangan harapan, merasa hampa.",
    rekomendasi:
        "Segera hubungi tenaga profesional atau layanan konseling kampus.",
    },
    "Sangat Berat": {
    gejala: "Perasaan putus asa yang sangat kuat, tidak bersemangat hidup.",
    rekomendasi: "Wajib segera melakukan konseling di UPT LKDPDEM UNDIP.",
    },
},
Kecemasan: {
    Ringan: {
    gejala: "Kadang merasa khawatir terhadap hal kecil.",
    rekomendasi: "Latihan pernapasan dan mindfulness dapat membantu.",
    },
    Sedang: {
    gejala: "Sering merasa gelisah tanpa alasan jelas.",
    rekomendasi: "Coba lakukan relaksasi teratur dan kurangi konsumsi kafein.",
    },
    Berat: {
    gejala: "Sulit berkonsentrasi dan sering panik.",
    rekomendasi: "Konsultasikan ke profesional bila gejala berlanjut.",
    },
    "Sangat Berat": {
    gejala: "Sering merasa takut ekstrem dan sulit mengendalikan diri.",
    rekomendasi: "Butuh penanganan psikolog atau psikiater.",
    },
},
Stres: {
    Ringan: {
    gejala: "Merasa tertekan sesekali, tetapi masih bisa mengatasinya.",
    rekomendasi: "Istirahat cukup dan atur waktu belajar lebih baik.",
    },
    Sedang: {
    gejala: "Mudah marah dan sulit tidur karena beban pikiran.",
    rekomendasi: "Luangkan waktu untuk rekreasi dan berolahraga.",
    },
    Berat: {
    gejala: "Sering tegang dan sulit fokus dalam aktivitas sehari-hari.",
    rekomendasi: "Lakukan relaksasi rutin atau meditasi ringan setiap hari.",
    },
    "Sangat Berat": {
    gejala: "Kelelahan ekstrem dan kehilangan kendali emosi.",
    rekomendasi: "Hubungi konselor segera untuk mendapatkan dukungan profesional.",
    },
},
};

const screenWidth = Dimensions.get("window").width - 30;
const levelKeterangan = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
};

// Fungsi untuk menentukan warna kategori (Tidak berubah)
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

const { data } = route.params || {
    data: {
    tanggal: "17/11",
    Depresi: 2,
    Kecemasan: 3,
    Stres: 1,
    },
};

const barData = {
    labels: ["Depresi", "Kecemasan", "Stres"],
    datasets: [{ data: [data.Depresi, data.Kecemasan, data.Stres] }],
};

const handleOpenLink = () => {
    Linking.openURL("https://linktr.ee/undip.studentcare");
};

return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>

    <View style={styles.card}>
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Pemantauan Mahasiswa", { userData })} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#041062" /> 
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Hasil Pemantauan</Text> 
                <Text style={styles.subtitle}>Tanggal: {data.tanggal}</Text>
            </View>
            <View style={{ width: 24 }} /> 
        </View>

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
        <Text style={styles.levelNote}>
        1 = Ringan | 2 = Sedang | 3 = Berat | 4 = Sangat Berat
        </Text>
    </View>

    {["Depresi", "Kecemasan", "Stres"].map((domain) => {
        const level = data[domain];
        const kategori = levelKeterangan[level];
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
            <Text style={styles.label}>Gejala:</Text>
            <Text style={styles.text}>{rekom.gejala}</Text>
            <Text style={styles.label}>Rekomendasi:</Text>
            <Text style={styles.text}>{rekom.rekomendasi}</Text>
        </View>
        );
    })}

    <View style={styles.section}>
        <Text style={styles.text}>
        "Kehidupan yang baik adalah sebuah proses, bukan suatu keadaan yang ada dengan
        sendirinya. Kehidupan itu sendiri adalah arah, bukan tujuan."
        </Text>
        <Text style={styles.author}>- Carl Rogers</Text>

        <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
        <Text style={styles.buttonText}>UNDIP STUDENT CARE</Text>
        </TouchableOpacity>
        <Text style={styles.cardDesc}>
        Klik tombol di atas untuk mendaftar konseling atau melihat layanan mahasiswa
        lainnya.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 10, 
    width: '100%',
},
backButton: {
    padding: 5, 
    marginRight: 10, 
},
headerTextContainer: {
    flex: 1, 
    alignItems: 'center', 
},

title: { fontSize: 18, fontWeight: "bold", color: "#041062", textAlign: 'center' },
subtitle: { fontSize: 14, color: "#666", marginBottom: 10, textAlign: 'center' },
levelNote: { marginTop: 8, fontSize: 12, color: "#666", textAlign: 'center' },
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