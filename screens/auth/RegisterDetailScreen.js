import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RegisterDetailScreen({ navigation }) {
const [nama, setNama] = useState("");
const [password, setPassword] = useState("");
const [ulangiPassword, setUlangiPassword] = useState("");
const [nim, setNim] = useState("");
const [fakultas, setFakultas] = useState("");
const [jurusan, setJurusan] = useState("");
const [semester, setSemester] = useState("");
const [gender, setGender] = useState("");

const handleNext = () => {
    if (!nama || !password || !ulangiPassword || !nim || !fakultas || !jurusan || !semester || !gender) {
    Alert.alert("Peringatan", "Harap isi semua data!");
    return;
    }
    if (password !== ulangiPassword) {
    Alert.alert("Peringatan", "Password tidak sama!");
    return;
    }
    Alert.alert("Sukses", "Data berhasil disimpan!");
    navigation.navigate("Login"); // arahkan ke halaman login
};

return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>SELESAIKAN PENDAFTARAN</Text>
    <Text style={styles.subtitle}>Lengkapi data dirimu sebelum melanjutkan.</Text>

    <Text style={styles.label}>Nama Panjang</Text>
    <TextInput style={styles.input} placeholder="Masukkan nama lengkap" value={nama} onChangeText={setNama} />

    <Text style={styles.label}>Buat Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Masukkan password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
    />

    <Text style={styles.label}>Ulangi Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Ulangi password"
        secureTextEntry
        value={ulangiPassword}
        onChangeText={setUlangiPassword}
    />

    <Text style={styles.label}>NIM</Text>
    <TextInput
        style={styles.input}
        placeholder="Masukkan NIM"
        keyboardType="numeric"
        value={nim}
        onChangeText={setNim}
    />

    <Text style={styles.label}>Fakultas</Text>
    <View style={styles.pickerContainer}>
        <Picker selectedValue={fakultas} onValueChange={(val) => setFakultas(val)}>
        <Picker.Item label="Pilih Fakultas" value="" />
        <Picker.Item label="Teknik" value="Teknik" />
        <Picker.Item label="Ekonomi" value="Ekonomi" />
        <Picker.Item label="Hukum" value="Hukum" />
        <Picker.Item label="Kedokteran" value="Kedokteran" />
        </Picker>
    </View>

    <Text style={styles.label}>Jurusan</Text>
    <View style={styles.pickerContainer}>
        <Picker selectedValue={jurusan} onValueChange={(val) => setJurusan(val)}>
        <Picker.Item label="Pilih Jurusan" value="" />
        <Picker.Item label="Teknik Komputer" value="Teknik Komputer" />
        <Picker.Item label="Teknik Elektro" value="Teknik Elektro" />
        <Picker.Item label="Teknik Mesin" value="Teknik Mesin" />
        </Picker>
    </View>

    <Text style={styles.label}>Semester</Text>
    <View style={styles.pickerContainer}>
        <Picker selectedValue={semester} onValueChange={(val) => setSemester(val)}>
        <Picker.Item label="Pilih Semester" value="" />
        {[...Array(12)].map((_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
        </Picker>
    </View>

    <Text style={styles.label}>Jenis Kelamin</Text>
    <View style={styles.pickerContainer}>
        <Picker selectedValue={gender} onValueChange={(val) => setGender(val)}>
        <Picker.Item label="Pilih Jenis Kelamin" value="" />
        <Picker.Item label="Laki-laki" value="Laki-laki" />
        <Picker.Item label="Perempuan" value="Perempuan" />
        </Picker>
    </View>

    <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>SELANJUTNYA</Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    padding: 20,
    backgroundColor: "#F8F9FE",
    flexGrow: 1,
},
title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
},
subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
},
label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
},
input: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
},
pickerContainer: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
},
button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
},
});
