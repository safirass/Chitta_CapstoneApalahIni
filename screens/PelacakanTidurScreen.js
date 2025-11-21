import React, { useEffect, useState, useRef } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ActivityIndicator,
} from "react-native";

import Container from "../components/container";
import Card from "../components/card";
import { readRecords } from "expo-health-connect";

export default function PelacakanTidurScreen({ navigation }) {
const [sleepData, setSleepData] = useState(null);
const [selectedData, setSelectedData] = useState(null);
const [loading, setLoading] = useState(true);
const scrollViewRef = useRef(null);

useEffect(() => {
    async function loadSleep() {
    try {
        const result = await readRecords("sleepSession");

        const mapped = result.records.map((r) => {
        const start = new Date(r.startTime);
        const end = new Date(r.endTime);

        const hours = (end - start) / 1000 / 3600;

        return {
            date: start.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            }),
            hours: hours,
            start: start.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            end: end.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        });

        setSleepData({ chart: mapped });

        if (mapped.length > 0) {
        setSelectedData(mapped[mapped.length - 1]);
        }
    } catch (err) {
        console.log("Gagal mengambil data tidur:", err);
        setSleepData(null);
    }

    setLoading(false);
    }

    loadSleep();
}, []);

useEffect(() => {
    if (sleepData && scrollViewRef.current) {
    setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: false });
    }, 200);
    }
}, [sleepData]);

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
        <Text style={styles.noDataText}>Tidak ada data tidur</Text>
    </View>
    );
}

const getSleepMessage = (hours) => {
    if (hours < 6) return "Anda kurang tidur.";
    if (hours <= 8) return "Kualitas tidur baik!";
    return "Anda tidur terlalu lama.";
};

return (
    <Container>
    {/* Chart */}
    <Card title="Grafik Pelacakan Tidur" type="info">
        <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={[
            styles.chartScroll,
            { width: sleepData.chart.length * 55 },
        ]}
        >
        {sleepData.chart.map((item, idx) => (
            <TouchableOpacity
            key={idx}
            style={styles.barContainer}
            onPress={() => setSelectedData(item)}
            >
            <View
                style={[
                styles.bar,
                {
                    height: item.hours * 10,
                    backgroundColor:
                    selectedData?.date === item.date ? "#041062" : "#534DD9",
                },
                ]}
            />
            <Text style={styles.barLabel}>{item.date}</Text>
            <Text style={styles.barHours}>{item.hours.toFixed(1)}j</Text>
            </TouchableOpacity>
        ))}
        </ScrollView>
    </Card>

    {/* Detail */}
    <Card title="Durasi Tidur Hari Ini">
        <Text style={styles.duration}>{selectedData?.hours.toFixed(1)} jam</Text>
        <Text style={styles.subText}>
        {selectedData?.start} - {selectedData?.end}
        </Text>
        <Text style={styles.subText}>{getSleepMessage(selectedData?.hours)}</Text>
    </Card>

    <Card title="Tips Tidur">
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Tips Tidur")}
        >
        <Text style={styles.buttonText}>Lihat Tips</Text>
        </TouchableOpacity>
    </Card>
    </Container>
);
}

const styles = StyleSheet.create({
center: { flex: 1, justifyContent: "center", alignItems: "center" },
noDataText: { fontSize: 14, color: "#777" },
chartScroll: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 90,
},
barContainer: { alignItems: "center", marginHorizontal: 6, width: 45 },
bar: { width: 30, borderRadius: 6 },
barLabel: { fontSize: 12 },
barHours: { fontSize: 11 },
duration: { fontSize: 28, fontWeight: "700", color: "#041062" },
subText: { fontSize: 14, color: "#555", marginTop: 4 },
button: {
    marginTop: 12,
    backgroundColor: "#534DD9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
},
buttonText: { color: "#fff", fontWeight: "600" },
});
