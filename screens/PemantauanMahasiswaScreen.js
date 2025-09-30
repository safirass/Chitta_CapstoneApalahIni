import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
        <Text>   - Kisarannya: sekelitar 40-79%</Text>
        <Text>   - Menunjukkan bahwa ringan yang murngkin mengganggu kesehatan</Text>
        <Text>   - tapi masih bisa diatasi</Text>
        <Text>b. Moderate (Sedang):</Text>
        <Text>   - Kisarannya: sekelitar 80-97%</Text>
        <Text>   - Menunjukkan kegila yang cukup signifikan dan mulai mengganggu</Text>
        <Text>   - fungsi sehari-hari</Text>
        <Text>c. Severe (Berat):</Text>
        <Text>   - Kisarannya: sekelitar 98-100%</Text>
        <Text>   - Menunjukkan kegila yang sangat signifikan dan sangat mengganggu fungsi</Text>
        <Text>   normal</Text>
        <Text>d. Ext. Severe (Sangat Parah):</Text>
        <Text>   - Kisarannya: sekelitar 97-100%</Text>
        <Text>   - Menunjukkan kondisi ekstrem yang memerlukaan perhatian medis</Text>
        <Text>   segera</Text>
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
    marginBottom: 10,
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