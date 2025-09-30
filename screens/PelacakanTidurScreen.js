import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

export default function PelacakanTidurScreen({ navigation }) {
const [sleepData, setSleepData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Simulasi ambil data dari API
    setTimeout(() => {
    // setSleepData(null); // Uncomment untuk test kondisi "tidak ada data"
    setSleepData({ //enih data dummy
        duration: "0j 0m",
        start: "--:--",
        end: "--:--",
        quality: "-",
        chart: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    });
    setLoading(false);
    }, 1000);
}, []);

if (loading) {
    return (
    <View style={styles.center}>
        <ActivityIndicator size="large" color="#534DD9" />
    </View>
    );
}

if (!sleepData) {
    return (
    <View style={styles.center}>
        <Text style={styles.noDataText}>Data belum tersedia</Text>
    </View>
    );
}

const parseDuration = (duration) => {
    const match = duration.match(/(\d+)j\s+(\d+)m/);
    if (!match) return 0;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours + minutes / 60;
};


const sleepHours = parseDuration(sleepData.duration);
let sleepMessage = "";
    if (sleepHours < 6) {
    sleepMessage = "Rentang waktu tidur kurang dari yang disarankan.";
    } else if (sleepHours >= 6 && sleepHours <= 8) {
    sleepMessage = "Tidur Anda berada pada rentang yang disarankan.";
    } else {
    sleepMessage = "Tidur Anda berlebihan, coba kurangi sedikit.";
    }



return (
    <ScrollView style={styles.container}>
    {/* Chart Placeholder */}
    <View style={styles.chartBox}>
        <Text style={styles.sectionTitle}>Pelacakan Tidur</Text>
        {/* Nanti ganti pakai BarChart atau LineChart */}
        <View style={styles.chartPlaceholder}>
        {sleepData.chart.map((val, idx) => (
            <View key={idx} style={[styles.bar, { height: val * 10 }]} />
        ))}
        </View>
    </View>

    {/* Durasi Tidur */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Durasi Tidur</Text>
        <Text style={styles.duration}>{sleepData.duration}</Text>
        <Text style={styles.subText}>
        {sleepData.start} - {sleepData.end}
        </Text>
        <Text style={styles.subText}>
        Waktu tidur cukup, Lorem ipsum dolor sit amet.
        </Text>
    </View>

    {/* Kualitas Tidur */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Kualitas Tidur</Text>
        <Text style={styles.subText}>
        {sleepData.start} - {sleepData.end}
        </Text>
        <View style={styles.qualityRow}>
        {[1, 2, 3, 4, 5].map((q) => (
            <View
            key={q}
            style={[
                styles.qualityBox,
                { backgroundColor: q <= sleepData.quality ? "#534DD9" : "#ddd" },
            ]}
            />
        ))}
        </View>
        <Text style={styles.subText}> 
            Anda tidur selama {sleepData.duration}. {sleepMessage}
        </Text>
    </View>

    {/* Tips */}
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Tips Meningkatkan Kualitas Tidur</Text>
        {/* <Text style={styles.subText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. */}
        {/* </Text> */}
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Tips Tidur")}
        >
        <Text style={styles.buttonText}>Lihat Tips</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#EFECFE", padding: 16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    noDataText: { fontSize: 16, color: "#999" },
    chartBox: { marginBottom: 16 },
    chartPlaceholder: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 12,
        height: 120,
    },
    bar: {
        width: 20,
        borderRadius: 6,
        backgroundColor: "#534DD9",
    },
    sectionTitle: { fontSize: 18, fontWeight: "600", color: "#041062" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    duration: { fontSize: 28, fontWeight: "700", color: "#041062" },
    subText: { fontSize: 14, color: "#555", marginTop: 4 },
    qualityRow: { flexDirection: "row", marginVertical: 8 },
    qualityBox: {
        width: 40,
        height: 12,
        marginRight: 4,
        borderRadius: 4,
    },
    button: {
        marginTop: 12,
        backgroundColor: "#534DD9",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600" },
});