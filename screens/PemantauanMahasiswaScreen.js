import React, { useState, useMemo, useEffect } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Dimensions,
Linking,
ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Container from "../components/container";
import Card from "../components/card";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width - 30;

// === DUMMY DATA fallback ===
const dummyRiwayatPerBulan = {
"Januari 2024": [
    { tanggal: "15/7", Depresi: 1, Kecemasan: 2, Stres: 1 },
    { tanggal: "22/7", Depresi: 2, Kecemasan: 3, Stres: 2 },
],
"September 2024": [
    { tanggal: "10/9", Depresi: 2, Kecemasan: 3, Stres: 1 },
    { tanggal: "12/9", Depresi: 1, Kecemasan: 2, Stres: 2 },
],
"Oktober 2024": [
    { tanggal: "01/10", Depresi: 2, Kecemasan: 2, Stres: 1 },
    { tanggal: "08/10", Depresi: 3, Kecemasan: 3, Stres: 2 },
    { tanggal: "15/10", Depresi: 1, Kecemasan: 2, Stres: 3 },
],
"November 2025": [
    { tanggal: "01/11", Depresi: 4, Kecemasan: 2, Stres: 4 },
    { tanggal: "08/11", Depresi: 4, Kecemasan: 3, Stres: 3 },
    { tanggal: "15/11", Depresi: 4, Kecemasan: 4, Stres: 4 },
],
};

const levelKeterangan = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
};

const monthNames = [
"Januari",
"Februari",
"Maret",
"April",
"Mei",
"Juni",
"Juli",
"Agustus",
"September",
"Oktober",
"November",
"Desember",
];

const generateMonthListFromData = (riwayatData) => {
const allKeys = Object.keys(riwayatData);
if (allKeys.length === 0) return [];

const firstKey = allKeys[0];
const [firstMonthName, firstYear] = firstKey.split(" ");
const startMonth = monthNames.indexOf(firstMonthName) + 1;
const startYear = parseInt(firstYear);

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const list = [];
let month = startMonth - 1;
let year = startYear;

while (year < currentYear || (year === currentYear && month <= currentMonth)) {
    list.push(`${monthNames[month]} ${year}`);
    month++;
    if (month > 11) {
    month = 0;
    year++;
    }
}
return list;
};

export default function RiwayatPemantauanScreen({ navigation }) {
const [riwayatPerBulan, setRiwayatPerBulan] = useState({});
const [loading, setLoading] = useState(true);

const monthList = useMemo(
    () => generateMonthListFromData(riwayatPerBulan),
    [riwayatPerBulan]
);

// Filter controls
const [selectedFilterYear, setSelectedFilterYear] = useState("");
const [selectedFilterMonthName, setSelectedFilterMonthName] = useState("");

// selectedMonth = "Bulan Tahun" yang digunakan untuk menampilkan data
const [selectedMonth, setSelectedMonth] = useState("");

// === Fetch data dari API / fallback ke dummy ===
useEffect(() => {
    const fetchData = async () => {
    try {
        if (typeof API_BASE_URL === "undefined") {
        throw new Error("API_BASE_URL tidak diset");
        }
        const res = await fetch(`${API_BASE_URL}/screening/riwayat`);
        if (!res.ok) throw new Error("Respon server tidak valid");
        const data = await res.json();

        setRiwayatPerBulan(data);
        console.log("✅ Data diambil dari API");
    } catch (error) {
        console.warn("⚠️ Gagal fetch API, gunakan dummy:", error.message);
        setRiwayatPerBulan(dummyRiwayatPerBulan);
    } finally {
        setLoading(false);
    }
    };

    fetchData();
}, []);

useEffect(() => {
    if (monthList.length > 0) {
    const last = monthList[monthList.length - 1]; // "Bulan Tahun"
    setSelectedMonth(last);

    const [mName, y] = last.split(" ");
    setSelectedFilterYear(y);
    setSelectedFilterMonthName(mName);
    }
}, [monthList]);

const availableYears = useMemo(() => {
    const ys = monthList.map((m) => m.split(" ")[1]);
    return Array.from(new Set(ys)).sort();
}, [monthList]);

const monthsForYear = useMemo(() => {
    if (!selectedFilterYear) return [];
    return monthList
    .filter((m) => m.endsWith(String(selectedFilterYear)))
    .map((m) => m.split(" ")[0]);
}, [monthList, selectedFilterYear]);

useEffect(() => {
    if (selectedFilterYear) {
    const mList = monthsForYear;
    if (mList.length > 0) {
        if (!mList.includes(selectedFilterMonthName)) {
        setSelectedFilterMonthName(mList[0]);
        setSelectedMonth(`${mList[0]} ${selectedFilterYear}`);
        } else {
        setSelectedMonth(`${selectedFilterMonthName} ${selectedFilterYear}`);
        }
    } else {
        setSelectedFilterMonthName("");
        setSelectedMonth("");
    }
    }
}, [selectedFilterYear]); // eslint-disable-line react-hooks/exhaustive-deps

useEffect(() => {
    if (selectedFilterMonthName && selectedFilterYear) {
    setSelectedMonth(`${selectedFilterMonthName} ${selectedFilterYear}`);
    }
}, [selectedFilterMonthName, selectedFilterYear]);

if (loading) {
    return (
    <Container>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#534DD9" />
        <Text style={{ color: "#534DD9", marginTop: 10 }}>Memuat data...</Text>
        </View>
    </Container>
    );
}

const dataBulanIni = riwayatPerBulan[selectedMonth] || [];
const chartData = {
    labels: dataBulanIni.map((d) => d.tanggal),
    datasets: [
    { data: dataBulanIni.map((d) => d.Depresi), color: () => "#FF6384" },
    { data: dataBulanIni.map((d) => d.Kecemasan), color: () => "#36A2EB" },
    { data: dataBulanIni.map((d) => d.Stres), color: () => "#FFCE56" },
    ],
    legend: ["Depresi", "Kecemasan", "Stres"],
};

const isEmpty = dataBulanIni.length === 0;

const handleOpenLink = () => Linking.openURL("https://linktr.ee/undip.studentcare");

const buildDetailFromItem = (item) => {
    const build = (domain) => ({
    keterangan: `Skor: ${item[domain] ?? "-"} — Kategori: ${levelKeterangan[item[domain]] ?? "-"}`,
    skor: item[domain] ?? null,
    });
    return {
    Depresi: build("Depresi"),
    Kecemasan: build("Kecemasan"),
    Stres: build("Stres"),
    };
};

return (
    <Container>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Isi Pemantauan")}
        >
        <Text style={styles.buttonText}>Lakukan Pemantauan</Text>
        </TouchableOpacity>

        {/* === Filter bar: Year + Month (HANYA PICKER) dengan label === */}
        <View style={styles.filterRow}>
        <View style={[styles.filterColumn, { width: 130 }]}>
            <Text style={styles.filterLabel}>Tahun</Text>
            <View style={styles.yearWrap}>
            <Picker
                selectedValue={selectedFilterYear}
                onValueChange={(val) => setSelectedFilterYear(val)}
                style={styles.pickerAndroid}
                mode="dropdown"
                dropdownIconColor="#041062"
            >
                <Picker.Item label="— Pilih Tahun —" value="" />
                {availableYears.map((y) => (
                <Picker.Item key={y} label={String(y)} value={String(y)} />
                ))}
            </Picker>
            </View>
        </View>

        <View style={[styles.filterColumn, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.filterLabel}>Bulan</Text>
            <View style={styles.monthWrap}>
            <Picker
                selectedValue={selectedFilterMonthName}
                onValueChange={(val) => setSelectedFilterMonthName(val)}
                enabled={monthsForYear.length > 0}
                style={styles.pickerAndroid}
                mode="dropdown"
                dropdownIconColor="#041062"
            >
                <Picker.Item label="— Pilih Bulan —" value="" />
                {monthsForYear.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
                ))}
            </Picker>
            </View>
        </View>
        </View>

        {/* === Grafik === */}
        <Card title={`Grafik Pemantauan ${selectedMonth}`} type="info">
        {isEmpty ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum melakukan pemantauan pada bulan ini.</Text>
            </View>
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(screenWidth, dataBulanIni.length * 100) }}>
                <LineChart
                data={chartData}
                width={Math.max(screenWidth, dataBulanIni.length * 100)}
                height={230}
                fromZero
                yAxisInterval={1}
                yLabelsOffset={10}
                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(4, 16, 98, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" },
                }}
                bezier
                style={{ borderRadius: 10 }}
                segments={4}
                yAxisMin={1}
                yAxisMax={4}
                />
                <Text style={styles.levelNote}>
                1 = Ringan | 2 = Sedang | 3 = Berat | 4 = Sangat Berat
                </Text>
            </View>
            </ScrollView>
        )}
        </Card>

        {/* === Riwayat === */}
        <Card title={`Riwayat Pemantauan ${selectedMonth}`}>
        {isEmpty ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum melakukan pemantauan pada bulan ini.</Text>
            </View>
        ) : (
            dataBulanIni.map((item, index) => (
            <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() =>
                navigation.navigate("Hasil Pemantauan", {
                    data: { ...item, detail: buildDetailFromItem(item) },
                })
                }
            >
                <Text style={styles.historyDate}>Tanggal: {item.tanggal}</Text>
                <Text style={styles.historyText}>
                Depresi: {levelKeterangan[item.Depresi]} | Kecemasan: {levelKeterangan[item.Kecemasan]} | Stres: {levelKeterangan[item.Stres]}
                </Text>
                <Text style={styles.moreText}>Lihat selengkapnya →</Text>
            </TouchableOpacity>
            ))
        )}
        </Card>

        {/* === Link Konseling === */}
        <Card title="Keterangan">
        <Text style={styles.text}>
            <Text style={styles.bold}>Ringan:</Text> Gejala ringan, dapat diatasi
            dengan relaksasi.
        </Text>
        <Text style={styles.text}>
            <Text style={styles.bold}>Sedang:</Text> Mulai mengganggu aktivitas,
            disarankan konsultasi.
        </Text>
        <Text style={styles.text}>
            <Text style={styles.bold}>Berat:</Text> Gejala intens, perlu dukungan
            profesional.
        </Text>
        <Text style={styles.text}>
            <Text style={styles.bold}>Sangat Berat:</Text> Gangguan fungsi harian,
            butuh psikiater.
        </Text>

        <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
            <Text style={styles.linkButtonText}>UNDIP Student Care</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>
            Klik tombol di atas untuk mendaftar konseling atau melihat layanan mahasiswa
            lainnya.
        </Text>
        </Card>
    </ScrollView>
    </Container>
);
}

const styles = StyleSheet.create({
scrollContainer: { paddingBottom: 30 },
button: {
    backgroundColor: "#041062",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
},
buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
filterRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
},
filterColumn: {
    flexDirection: "column",
},
filterLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: "600",
},
yearWrap: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6FA",
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 6,
    color: "#000",
},
monthWrap: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E6E6FA",
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 6,
    color: "#000",
},
pickerAndroid: {
    height: 48,
    width: "100%",
    color: "#041062",
    fontSize: 15,
},
emptyContainer: { alignItems: "center", paddingVertical: 20 },
emptyText: { color: "#777", fontSize: 14 },
levelNote: { textAlign: "center", fontSize: 12, color: "#555", marginTop: 8 },
historyItem: {
    backgroundColor: "#F4F4FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0FF",
},
historyDate: { fontWeight: "bold", color: "#041062", marginBottom: 4 },
moreText: {
    marginTop: 8,
    color: "#4275daff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
},
historyText: { color: "#333", fontSize: 13 },
linkButton: {
    backgroundColor: "#534DD9",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
},
linkButtonText: { color: "#fff", fontWeight: "bold" },
infoText: { fontSize: 12, color: "#555", textAlign: "center", marginTop: 6 },
text: { color: "#333", fontSize: 14, marginBottom: 5, lineHeight: 20 },
bold: { fontWeight: "bold", color: "#041062" },
});