import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import Container from "../components/container";
import Card from "../components/card";

const dummyStressData = [
{ date: "2025-01-01", level: 2 },
{ date: "2025-01-02", level: 3 },
{ date: "2025-01-03", level: 1 },
{ date: "2025-01-04", level: 2 },
{ date: "2025-01-05", level: 2 },
{ date: "2025-01-06", level: 3 },
{ date: "2025-01-07", level: 1 },
{ date: "2025-01-08", level: 2 },
{ date: "2025-01-09", level: 2 },
{ date: "2025-01-10", level: 3 },
{ date: "2025-01-11", level: 2 },
{ date: "2025-01-12", level: 1 },
];

export default function PemantauanStresScreen({ navigation }) {
const [selectedDate, setSelectedDate] = useState(dummyStressData[dummyStressData.length - 1]?.date);
const [selectedData, setSelectedData] = useState(null);
const scrollRef = useRef(null);
const screenWidth = Dimensions.get("window").width;

useEffect(() => {
    const data = dummyStressData.find((item) => item.date === selectedDate);
    setSelectedData(data);
}, [selectedDate]);

// scroll otomatis ke kanan
useEffect(() => {
    if (scrollRef.current && dummyStressData.length > 0) {
    setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: true });
    }, 100);
    }
}, []);

const getLevelDescription = (level) => {
    if (level === 1) return "Rendah";
    if (level === 2) return "Sedang";
    if (level === 3) return "Tinggi";
};

const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short" };
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", options);
};

return (
    <Container>
    <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Grafik Pemantauan Stres</Text>

        <Card style={styles.graphWrapper}>
        {dummyStressData.length > 0 ? (
            <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.graphScrollContainer,
                {
                minWidth: Math.max(screenWidth - 60, dummyStressData.length * 50),
                justifyContent: dummyStressData.length < 7 ? "flex-end" : "flex-start",
                },
            ]}
            >
            {dummyStressData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                <Text style={styles.levelLabel}>{getLevelDescription(item.level)}</Text>

                <TouchableOpacity
                    onPress={() => setSelectedDate(item.date)}
                    style={[
                    styles.bar,
                    {
                        height: item.level * 35 + 20,
                        backgroundColor:
                        item.level === 1
                            ? "#FFD93D"
                            : item.level === 2
                            ? "#FFB302"
                            : "#E74C3C",
                        borderWidth: item.date === selectedDate ? 2 : 0,
                        borderColor: item.date === selectedDate ? "#041062" : "transparent",
                    },
                    ]}
                />

                <Text style={styles.dateLabel}>{formatDate(item.date)}</Text>
                </View>
            ))}
            </ScrollView>
        ) : (
            <View style={styles.emptyGraphContainer}>
            <Text style={styles.emptyText}>Belum ada data pemantauan stres.</Text>
            </View>
        )}
        </Card>

        {selectedData && (
        <Card>
            <Text style={styles.dateText}>
            {new Date(selectedData.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })}
            </Text>
            <Text style={styles.levelText}>
            Tingkat stres kamu hari ini pada level {selectedData.level},{" "}
            yaitu{" "}
            <Text style={{ fontWeight: "600" }}>
                {getLevelDescription(selectedData.level)}
            </Text>
            .
            </Text>
            <Text style={styles.desc}>
            {selectedData.level === 1
                ? "Kondisimu baik! Pertahankan rutinitas positif seperti tidur cukup dan olahraga ringan."
                : selectedData.level === 2
                ? "Kamu berada di level sedang. Coba luangkan waktu untuk relaksasi dan mindfulness."
                : "Kamu sedang mengalami stres tinggi. Istirahat sejenak, dan pertimbangkan berbicara dengan konselor."}
            </Text>
        </Card>
        )}

        <Card style={styles.linkCard}>
        <TouchableOpacity onPress={() => navigation.navigate("Kesadaran Penuh")}>
            <Text style={styles.linkTitle}>Kesadaran Penuh {">"}</Text>
            <Text style={styles.linkDesc}>
            Ruang untuk kamu fokus, menulis jurnal, dan merasakan ketenangan.
            </Text>
        </TouchableOpacity>
        </Card>

        <Card style={styles.linkCard}>
        <TouchableOpacity onPress={() => navigation.navigate("Tips Stres")}>
            <Text style={styles.linkTitle}>Tips Mengatasi Stres {">"}</Text>
            <Text style={styles.linkDesc}>
            Dapatkan tips dan saran untuk mengelola stres dengan lebih baik.
            </Text>
        </TouchableOpacity>
        </Card>
    </ScrollView>
    </Container>
);
}

const styles = StyleSheet.create({
title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 16,
    textAlign: "center",
},
graphWrapper: {
    paddingVertical: 20,
    marginBottom: 25,
},
graphScrollContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
},
barContainer: {
    alignItems: "center",
    marginHorizontal: 10,
},
levelLabel: {
    fontSize: 11,
    color: "#555",
    marginBottom: 4,
},
bar: {
    width: 25,
    borderRadius: 10,
},
dateLabel: {
    marginTop: 6,
    fontSize: 11,
    color: "#041062",
},
emptyGraphContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
},
emptyText: {
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
},
dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#041062",
    marginBottom: 8,
},
levelText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
},
desc: {
    fontSize: 13,
    color: "#555",
},
linkCard: {
    marginBottom: 15,
},
linkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#041062",
},
linkDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
},
});
