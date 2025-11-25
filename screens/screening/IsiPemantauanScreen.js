import React, { useState, useEffect } from "react";
import {
View,
Text,
TouchableOpacity,
ScrollView,
StyleSheet,
ActivityIndicator,
Alert,
} from "react-native";
import axios from "axios";
import { PertanyaanDASS } from "../../data/PertanyaanDASS";
import { kategoriToLevel } from "../../data/kategoriToLevel";

const options = ["TS", "AS", "S", "SS"];

export default function IsiPemantauanScreen({ navigation }) {
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});
const [loading, setLoading] = useState(false);

const API_BASE_URL = "http://10.0.2.2:8000/api";

useEffect(() => {
    setQuestions(PertanyaanDASS);
}, []);

const handleSelect = (code, option) => {
    setAnswers({ ...answers, [code]: option });
};

const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
    Alert.alert("Peringatan", "Silakan jawab semua pertanyaan terlebih dahulu.");
    return;
    }

    setLoading(true);
    try {
    const response = await axios.post(`${API_BASE_URL}/screening`, {
        jawaban: answers,
    });

    const result = response.data.result;

    navigation.navigate("Hasil Pemantauan", {
        data: {
        tanggal: new Date().toLocaleDateString("id-ID"),

        // convert kategori → angka untuk grafik
        Depresi: kategoriToLevel[result.Depresi.kategori],
        Kecemasan: kategoriToLevel[result.Kecemasan.kategori],
        Stres: kategoriToLevel[result.Stres.kategori],

        // kirim kategori + keterangan asli dari FastAPI
        detail: result,
        },
    });
    } catch (error) {
    console.log("ERROR:", error);
    Alert.alert("Gagal", "Terjadi kesalahan saat memproses data.");
    } finally {
    setLoading(false);
    }
};

return (
    <ScrollView style={styles.container}>
    <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Bagaimana Perasaan Anda Selama Satu Minggu Terakhir?</Text>
        <Text style={styles.infoText}>
        Silakan pilih jawaban yang paling mencerminkan keadaan Anda selama satu minggu terakhir.
        </Text>
        <Text style={styles.infoText}>
        Skala jawaban:{"\n"}TS = Tidak Sesuai{"\n"}AS = Agak Sesuai{"\n"}S = Sesuai{"\n"}SS = Sangat Sesuai
        </Text>
    </View>

    {questions.map((q) => (
        <View key={q.code} style={styles.questionBox}>
        <Text style={styles.questionText}>{q.text}</Text>
        <View style={styles.optionRow}>
            {options.map((option) => (
            <TouchableOpacity
                key={option}
                style={[
                styles.optionButton,
                answers[q.code] === option && styles.selectedOption,
                ]}
                onPress={() => handleSelect(q.code, option)}
            >
                <Text
                style={[
                    styles.optionText,
                    answers[q.code] === option && styles.selectedText,
                ]}
                >
                {option}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
        </View>
    ))}

    {loading ? (
        <ActivityIndicator size="large" color="#534DD9" style={{ marginVertical: 20 }} />
    ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>KIRIM JAWABAN</Text>
        </TouchableOpacity>
    )}
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#F3EFFF", padding: 16 },
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
infoText: { fontSize: 14, color: "#333", marginBottom: 6 },
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
optionText: { color: "#041062", fontWeight: "600" },
selectedOption: { backgroundColor: "#534DD9" },
selectedText: { color: "#fff" },
submitButton: {
    backgroundColor: "#534DD9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
},
submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
