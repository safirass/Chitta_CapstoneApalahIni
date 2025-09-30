import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const questions = [
"Soal 1",
"Soal 2",
"Soal 3",
"Soal 4",
];

const options = ["TS", "AS", "S", "SS"];

export default function IsiPemantauanScreen() {
const [answers, setAnswers] = useState({});

const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
};

return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>Pemantauan Mahasiswa</Text>
    <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Bagaimana Perasaan Anda Selama Satu Minggu Terakhir?</Text>
        <Text style={styles.infoText}>
        Di bawah ini terdapat beberapa pernyataan yang menggambarkan berbagai perasaan dan pengalaman.
        {"\n\n"}Silakan pilih jawaban yang paling mencerminkan keadaan Anda selama satu minggu terakhir.
        {"\n\n"}Tidak ada jawaban yang benar atau salah, yang terpenting adalah kejujuran Anda.
        </Text>
        <Text style={styles.infoText}>
        Gunakan skala berikut untuk menjawab:
        {"\n"}- TS = Tidak Sesuai
        {"\n"}- AS = Agak Sesuai
        {"\n"}- S = Sesuai
        {"\n"}- SS = Sangat Sesuai
        </Text>
    </View>

    {questions.map((q, qIndex) => (
        <View key={qIndex} style={styles.questionBox}>
        <Text style={styles.questionText}>{q}</Text>
        <View style={styles.optionRow}>
            {options.map((option) => (
            <TouchableOpacity
                key={option}
                style={[
                styles.optionButton,
                answers[qIndex] === option && styles.selectedOption,
                ]}
                onPress={() => handleSelect(qIndex, option)}
            >
                <Text
                style={[
                    styles.optionText,
                    answers[qIndex] === option && styles.selectedText,
                ]}
                >
                {option}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
        </View>
    ))}

    <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>SUBMIT</Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#f3f0ff",
    padding: 16,
},
title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#041062",
},
infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
},
infoTitle: {
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
    color: "#041062",
},
infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
},
questionBox: {
    backgroundColor: "#e6e1fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
},
questionText: {
    fontSize: 15,
    marginBottom: 12,
    color: "#041062",
    fontWeight: "600",
},
optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
},
optionButton: {
    backgroundColor: "#d1c9f7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 4,
    flex: 1,
    alignItems: "center",
},
optionText: {
    color: "#041062",
    fontWeight: "600",
},
selectedOption: {
    backgroundColor: "#534DD9",
},
selectedText: {
    color: "#fff",
},
submitButton: {
    backgroundColor: "#534DD9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
},
submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
},
});
