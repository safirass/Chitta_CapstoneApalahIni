import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//ini nanti dibikin dummy data dulu abis itu fetch dari api


const RiwayatPemantauan = ({ navigation }) => {
return (
    <View style={styles.container}>
    <View style={styles.card}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Isi Pemantauan")}
        >
        <Text style={styles.buttonText}>Lakukan Pemantauan</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Grafik Pemantauan yang Telah Dilakukan</Text>
        <Text style={styles.placeholder}>Belum dilakukan pemantauan</Text>
    </View>
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Keterangan</Text>
        <Text>a. Mild (Ringan):</Text>
        <Text>   - Depresi Ringan: Perasaan sedih sesekali, kehilangan minat ringan, mudah lelah, kurang semangat.</Text>
        <Text>   - Kecemasan Ringan: Gugup, waspada berlebihan.</Text>
        <Text>   - Stres Ringan: Mudah terganggu, tidak sabaran.</Text>
        <Text>b. Moderate (Sedang):</Text>
        <Text>   - Depresi Sedang: Sedih terus-menerus, gangguan tidur, harga diri rendah, kesulitan berkonsentrasi, menarik diri dari aktivitas sosial.</Text>
        <Text>   - Kecemasan Sedang: Gemetar, berkeringat, takut akan bahaya.</Text>
        <Text>   - Stres Sedang: Sulit rileks, mudah marah, mudah kaget.</Text>
        <Text>c. Severe (Berat):</Text>
        <Text>   - Depresi Berat: Putus asa, tidak berharga, gangguan tidur berat, nafsu makan turun/naik drastis, sulit fokus, mungkin sudah muncul pikiran untuk tidak ingin hidup.</Text>
        <Text>   - Kecemasan Berat: Sulit bernapas, takut kehilangan kendali.</Text>
        <Text>   - Stres Berat: Tertekan, sulit berkonsentrasi, mudah lelah.</Text>
        <Text>d. Ext. Severe (Sangat Parah):</Text>
        <Text>   - Depresi Sangat Berat: Pikiran untuk bunuh diri, rasa hampa total, tidak mampu melakukan aktivitas dasar (mandi, makan), isolasi total, mungkin mengalami gejala psikotik (dalam kasus ekstrem).</Text>
        <Text>   - Kecemasan Sangat Berat: Serangan panik, menghindari situasi sosial, kemungkinan serangan panik yang menyebabkan emergency.</Text>
        <Text>   - Stres Sangat Berat: Gejala somatik, burnout, gangguan fungsi sehari-hari.</Text>
    </View>
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Riwayat Pemantauan</Text>
    </View>
    <View style={styles.card}>
        <Text style={styles.placeholder}>Belum dilakukan pemantauan</Text>
    </View>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F3EFFF',
    padding: 10,
},
backButton: {
    fontSize: 24,
    marginRight: 10,
},
title: {
    fontSize: 20,
    fontWeight: 'bold',
},
section: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'justifyContent',
},
sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
},
card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
},
cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
},
placeholder: {
    fontSize: 14,
    color: '#888',
},
button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
},
buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
},
});

export default RiwayatPemantauan;