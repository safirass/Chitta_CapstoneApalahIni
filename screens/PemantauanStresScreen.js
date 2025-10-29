import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

// === Data Dummy ===
const dummyStressData = [
{ date: "2025-01-01", level: 3 },
{ date: "2025-01-02", level: 2 },
{ date: "2025-01-03", level: 1 },
{ date: "2025-01-04", level: 2 },
{ date: "2025-01-05", level: 3 },
{ date: "2025-01-06", level: 1 },
{ date: "2025-01-07", level: 3 },
];

export default function PemantauanStresScreen({ navigation }) {
const [selectedDate, setSelectedDate] = useState("2025-01-07");
const [selectedData, setSelectedData] = useState(null);

useEffect(() => {
    const data = dummyStressData.find((item) => item.date === selectedDate);
    setSelectedData(data);
}, [selectedDate]);

const getLevelDescription = (level) => {
    if (level === 1) return "rendah";
    if (level === 2) return "sedang";
    if (level === 3) return "tinggi";
};

return (
    <ScrollView style={styles.container}>

    {/* Bagian Grafik Sederhana */}
    <View style={styles.graphContainer}>
        {dummyStressData.map((item, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => setSelectedDate(item.date)}
            style={[
            styles.bar,
            {
                height: item.level * 30 + 20,
                backgroundColor:
                item.level === 1
                    ? "#FFD93D"
                    : item.level === 2
                    ? "#FFB302"
                    : "#E74C3C",
            },
            ]}
        />
        ))}
    </View>

    {/* Informasi Detail */}
    {selectedData && (
        <View style={styles.card}>
        <Text style={styles.dateText}>7 Januari 2025</Text>
        <Text style={styles.levelText}>
            Tingkat stres kamu hari ini pada level {selectedData.level},{" "}
            yang artinya berada pada level {getLevelDescription(selectedData.level)}.
        </Text>
        <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam orci eros,
            feugiat nec lobortis quis, feugiat et augue. Fusce ac leo eu ante rutrum
            fringilla at vitae massa. Fusce tellus purus, volutpat ut tristique in,
            dictum vel est.
        </Text>
        </View>
    )}

    {/* Navigasi ke fitur lain */}
    <TouchableOpacity
        style={styles.linkCard}
        onPress={() => navigation.navigate("Kesadaran Penuh")}
    >
        <Text style={styles.linkTitle}>Kesadaran Penuh {">"}</Text>
        <Text style={styles.linkDesc}>
        Ruang untuk kamu fokus, menulis jurnal, dan merasakan ketenangan.
        </Text>
    </TouchableOpacity>

    <TouchableOpacity
        style={styles.linkCard}
        onPress={() => navigation.navigate("Tips Stres")}
    >
        <Text style={styles.linkTitle}>Tips Mengatasi Stres {">"}</Text>
        <Text style={styles.linkDesc}>
        Dapatkan tips dan saran untuk mengelola stres dengan lebih baik.
        </Text>
    </TouchableOpacity>
    </ScrollView>
);
}

// === STYLE ===
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#F5F4FF",
    paddingHorizontal: 16,
    paddingTop: 50,
},
title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 20,
},
graphContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
},
bar: {
    width: 20,
    borderRadius: 10,
},
card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
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
