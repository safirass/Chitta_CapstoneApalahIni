import { useEffect, useState, useRef } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Platform,
} from "react-native";

import Container from "../components/container";
import Card from "../components/card";

export default function PemantauanStresScreen({ navigation }) {
const [stressData, setStressData] = useState([]);
const [selectedDate, setSelectedDate] = useState(null);
const [selectedData, setSelectedData] = useState(null);

const scrollRef = useRef(null);
const dateScrollRef = useRef(null);

useEffect(() => {
    async function loadData() {
    try {
        if (Platform.OS !== "android") {
        console.log("Health Connect hanya untuk Android");
        return;
        }

        // dynamic import supaya bundler iOS/Web tidak crash
        const HC = await import("expo-health-connect");
        const readRecords = HC.readRecords;

        const result = await readRecords("heartRate");

        // group by date
        const grouped = {};

        result.records.forEach((r) => {
        const time = new Date(r.time);
        const dateKey = time.toLocaleDateString("id-ID");

        const stressed = r.beatsPerMinute > 100;

        if (!grouped[dateKey]) grouped[dateKey] = [];

        grouped[dateKey].push({
            hour: time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            }),
            stressed,
            bpm: r.beatsPerMinute,
        });
        });

        const final = Object.keys(grouped).map((date) => ({
        date,
        hourly: grouped[date],
        }));

        setStressData(final);

        if (final.length > 0) {
        setSelectedDate(final[final.length - 1].date);
        setSelectedData(final[final.length - 1]);
        }
    } catch (e) {
        console.log("Error baca heart rate:", e);
    }
    }

    loadData();
}, []);

useEffect(() => {
    if (selectedDate) {
    const data = stressData.find((d) => d.date === selectedDate);
    setSelectedData(data);
    }
}, [selectedDate]);

return (
    <Container>
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* PILIH TANGGAL */}
        <View style={styles.dateContainer}>
        <ScrollView
            horizontal
            ref={dateScrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
        >
            {stressData.map((item, i) => (
            <TouchableOpacity
                key={i}
                style={[
                styles.dateButton,
                selectedDate === item.date && styles.dateButtonActive,
                ]}
                onPress={() => setSelectedDate(item.date)}
            >
                <Text
                style={[
                    styles.dateText,
                    selectedDate === item.date && styles.dateTextActive,
                ]}
                >
                {item.date}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
        </View>

        {/* Chart */}
        {selectedData && (
        <Card style={styles.graphCard} type="info">
            <Text style={styles.title}>Riwayat Stres {selectedDate}</Text>

            <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.barRowContainer}
            >
            <View style={styles.barRow}>
                {selectedData.hourly.map((item, idx) => {
                const barHeight = item.stressed ? 70 : 40;

                return (
                    <View key={idx} style={styles.barContainer}>
                    <Text style={styles.levelLabel}>
                        {item.stressed ? "Stres" : "Relax"}
                    </Text>
                    <View
                        style={[
                        styles.bar,
                        {
                            height: barHeight,
                            backgroundColor: item.stressed
                            ? "#E74C3C"
                            : "#2ECC71",
                        },
                        ]}
                    />
                    <Text style={styles.hourLabel}>{item.hour}</Text>
                    <Text style={{ fontSize: 10, color: "#333" }}>
                        {item.bpm} bpm
                    </Text>
                    </View>
                );
                })}
            </View>
            </ScrollView>
        </Card>
        )}

        {/* List */}
        {selectedData?.hourly && (
        <Card>
            {selectedData.hourly.map((item, idx) => (
            <Text key={idx} style={styles.descText}>
                {item.hour}: {item.stressed ? "Stres" : "Relax"} ({item.bpm} BPM){" "}
                {item.stressed
                ? "- Detak jantung tinggi, sebaiknya lakukan relaksasi."
                : "- Kondisi stabil, pertahankan aktivitas positif."}
            </Text>
            ))}
        </Card>
        )}

        {/* Links */}
        <Card style={styles.linkCard}>
        <TouchableOpacity onPress={() => navigation.navigate("Kesadaran Penuh")}>
            <Text style={styles.linkTitle}>Kesadaran Penuh {">"}</Text>
            <Text style={styles.linkDesc}>Latihan fokus dan meditasi.</Text>
        </TouchableOpacity>
        </Card>

        <Card style={styles.linkCard}>
        <TouchableOpacity onPress={() => navigation.navigate("Tips Stres")}>
            <Text style={styles.linkTitle}>Tips Mengatasi Stres {">"}</Text>
            <Text style={styles.linkDesc}>Panduan praktis mengurangi stres.</Text>
        </TouchableOpacity>
        </Card>
    </ScrollView>
    </Container>
);
}

const styles = StyleSheet.create({
dateContainer: { marginBottom: 15 },
dateScrollContent: { flexGrow: 1, paddingHorizontal: 10 },
dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#E9E8FF",
},
dateButtonActive: { backgroundColor: "#534DD9" },
dateText: { fontSize: 12, color: "#041062" },
dateTextActive: { color: "#fff", fontWeight: "600" },
graphCard: { paddingVertical: 20, marginBottom: 20 },
title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 15,
    textAlign: "center",
},
barRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "flex-end",
},
barContainer: { alignItems: "center", marginHorizontal: 8 },
levelLabel: { fontSize: 10 },
hourLabel: { fontSize: 10 },
bar: { width: 24, borderRadius: 5 },
descText: { fontSize: 13, marginBottom: 8 },
linkCard: { marginBottom: 15 },
linkTitle: { fontSize: 16, fontWeight: "600" },
linkDesc: { fontSize: 13, marginTop: 4 },
});
