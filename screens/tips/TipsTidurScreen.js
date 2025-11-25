import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function TipsTidurScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Tips Tidur Berkualitas</Text>

                <Image
                    source={require('../../assets/tidur.jpg')}
                    style={styles.image}
                />

                <Text style={styles.desc}>
                    1. Cek apa yang kamu makan & minum seharian atau 1–2 jam sebelum tidur.
                    {'\n'}- Jika metabolisme rendah, minum kopi pagi/siang bisa bikin melek sampai subuh.
                    {'\n'}- Jangan tidur setelah makan berat, beri jeda sekitar 2 jam.
                </Text>

                <Text style={styles.desc}>
                    2. Persiapkan tubuh untuk tidur.
                    {'\n'}Jika terlalu capek, tubuh malah sulit tidur. Pijat lembut area tegang: kepala, wajah, tengkuk, pundak, betis, hingga telapak kaki.
                    {'\n'}Jika pikiran mengganggu, katakan: "Sementara cukup untuk hari ini. Besok lagi ya."
                </Text>

                <Text style={styles.desc}>
                    3. Siapkan suasana yang mendukung.
                    {'\n'}Ruang yang rapi, bersih, nyaman dilihat. Pilih warna sprei yang kamu suka. Buang sampah, gunakan pewangi ruangan jika perlu.
                    {'\n'}Putar musik pengantar tidur jika itu membantu.
                </Text>

                <Text style={styles.desc}>
                    4. Padamkan lampu agar tubuh menghasilkan melatonin optimal.
                    {'\n'}Tidur gelap membuat tubuh melakukan pembersihan sampah sel & regenerasi sehingga bangun lebih segar.
                </Text>

                <Text style={styles.desc}>
                    5. Tubuhmu butuh istirahat, bukan hanya tidur.
                    {'\n'}Jangan biasakan obat tidur. Fokus pada kualitas istirahat agar bangun tidak capek.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFECFE',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 12,
    },
    desc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
        lineHeight: 20,
    },
});
