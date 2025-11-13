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

const options = ["TS", "AS", "S", "SS"];

export default function IsiPemantauanScreen({ navigation }) {
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);

// ganti ke URL backend kamu nanti
const API_BASE_URL = "http://10.0.2.2:8000/api";

useEffect(() => {
        setQuestions([
        { code: "D01", text: "Saya merasa sedih tanpa alasan yang jelas." },
        { code: "A01", text: "Saya merasa gugup tanpa alasan yang jelas." },
        { code: "S01", text: "Saya sulit untuk merasa rileks." },
        { code: "D02", text: "Saya kehilangan minat pada hal-hal yang dulu menyenangkan." },
        { code: "S02", text: "Saya merasa mudah tersinggung." },
        ]);
    }
, []);
// // ==== AMBIL DATA PERTANYAAN ====
// useEffect(() => {
//     const fetchQuestions = async () => {
//     try {
//         const res = await axios.get(`${API_BASE_URL}/screening/questions`);
//         setQuestions(res.data);
//     } catch (err) {
//         console.log("⚠️ Backend tidak aktif, gunakan dummy lokal.");
//         // Dummy pertanyaan (berdasarkan DASS-21)
//         setQuestions([
//         { code: "D01", text: "Saya merasa sedih tanpa alasan yang jelas." },
//         { code: "A01", text: "Saya merasa gugup tanpa alasan yang jelas." },
//         { code: "S01", text: "Saya sulit untuk merasa rileks." },
//         { code: "D02", text: "Saya kehilangan minat pada hal-hal yang dulu menyenangkan." },
//         { code: "S02", text: "Saya merasa mudah tersinggung." },
//         ]);
//     }
//     };
//     fetchQuestions();
// }, []);

// ==== PILIH JAWABAN ====
const handleSelect = (code, option) => {
    setAnswers({ ...answers, [code]: option });
};

const handleSubmit = async () => {
if (Object.keys(answers).length < questions.length) {
    Alert.alert("Peringatan", "Silakan jawab semua pertanyaan terlebih dahulu.");
    return;
}

setLoading(true);
    const dummyResult = {
    depression: {
        kategori: "Sedang",
        skor: 14,
        keterangan: "Perlu memperhatikan pola tidur dan aktivitas positif.",
    },
    anxiety: {
        kategori: "Ringan",
        skor: 8,
        keterangan: "Masih dalam batas wajar, pertahankan keseimbangan hidup.",
    },
    stress: {
        kategori: "Sedang",
        skor: 16,
        keterangan: "Luangkan waktu untuk relaksasi dan kegiatan menyenangkan.",
    },
    };

    setResult(dummyResult);

    // navigasi pakai data dummy juga
    navigation.navigate("Hasil Pemantauan", {
    data: {
        tanggal: new Date().toLocaleDateString("id-ID"),
        Depresi: mapKategoriToLevel(dummyResult.depression.kategori),
        Kecemasan: mapKategoriToLevel(dummyResult.anxiety.kategori),
        Stres: mapKategoriToLevel(dummyResult.stress.kategori),
    },
    });
}

// setLoading(true);
// try {
//     const response = await axios.post(`${API_BASE_URL}/screening`, {
//     user_id: 1, // nanti pakai id user login
//     answers,
//     });

//     // hasil dari backend (sudah disimpan di database)
//     const data = response.data;
//     setResult(data);

//     // langsung navigasi ke halaman hasil pemantauan
//     navigation.navigate("Hasil Pemantauan", {
//     data: {
//         tanggal: new Date().toLocaleDateString("id-ID"),
//         Depresi: mapKategoriToLevel(data.depression.kategori),
//         Kecemasan: mapKategoriToLevel(data.anxiety.kategori),
//         Stres: mapKategoriToLevel(data.stress.kategori),
//     },
//     });
// } catch (error) {
//     console.log(" Gagal kirim ke backend, gunakan dummy hasil.");

//     const dummyResult = {
//     depression: {
//         kategori: "Sedang",
//         skor: 14,
//         keterangan: "Perlu memperhatikan pola tidur dan aktivitas positif.",
//     },
//     anxiety: {
//         kategori: "Ringan",
//         skor: 8,
//         keterangan: "Masih dalam batas wajar, pertahankan keseimbangan hidup.",
//     },
//     stress: {
//         kategori: "Sedang",
//         skor: 16,
//         keterangan: "Luangkan waktu untuk relaksasi dan kegiatan menyenangkan.",
//     },
//     };

//     setResult(dummyResult);

//     // navigasi pakai data dummy juga
//     navigation.navigate("Hasil Pemantauan", {
//     data: {
//         tanggal: new Date().toLocaleDateString("id-ID"),
//         Depresi: mapKategoriToLevel(dummyResult.depression.kategori),
//         Kecemasan: mapKategoriToLevel(dummyResult.anxiety.kategori),
//         Stres: mapKategoriToLevel(dummyResult.stress.kategori),
//     },
//     });
// } finally {
//     setLoading(false);
// }
// };


// fungsi bantu: ubah "Sedang" → angka level (1–4)
const mapKategoriToLevel = (kategori) => {
switch (kategori) {
    case "Ringan":
    return 1;
    case "Sedang":
    return 2;
    case "Berat":
    return 3;
    case "Sangat Berat":
    return 4;
    default:
    return 1;
}
};


// ==== UI ====
return (
    <ScrollView style={styles.container}>
    {/* Info atas */}
    <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Bagaimana Perasaan Anda Selama Satu Minggu Terakhir?</Text>
        <Text style={styles.infoText}>
        Silakan pilih jawaban yang paling mencerminkan keadaan Anda selama satu minggu terakhir.
        </Text>
        <Text style={styles.infoText}>
        Skala jawaban:{"\n"}TS = Tidak Sesuai{"\n"}AS = Agak Sesuai{"\n"}S = Sesuai{"\n"}SS = Sangat Sesuai
        </Text>
    </View>

    {/* Daftar pertanyaan */}
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

    {/* Tombol submit */}
    {loading ? (
        <ActivityIndicator size="large" color="#534DD9" style={{ marginVertical: 20 }} />
    ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>KIRIM JAWABAN</Text>
        </TouchableOpacity>
    )}

    {/* Hasil Screening */}
    {result && (
        <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>Hasil Pemantauan</Text>
        {Object.entries(result).map(([kategori, detail]) => (
            <View key={kategori} style={styles.resultItem}>
            <Text style={styles.resultCategory}>
                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}:{" "}
                <Text style={{ color: "#534DD9" }}>{detail.kategori}</Text>
            </Text>
            <Text style={styles.resultText}>{detail.keterangan}</Text>
            </View>
        ))}
        </View>
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
resultBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 30,
},
resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#041062",
    marginBottom: 10,
},
resultItem: { marginBottom: 10 },
resultCategory: {
    fontWeight: "700",
    color: "#041062",
    fontSize: 15,
    marginBottom: 4,
},
resultText: { fontSize: 14, color: "#333", marginBottom: 6 },
});
