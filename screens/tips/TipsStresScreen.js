import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function TipsStresScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Tips Mengurangi Stres</Text>

                <Image
                    source={require('../../assets/stres.jpg')}
                    style={styles.image}
                />

                <Text style={styles.desc}>
                    1. Klasifikasikan prioritas masalahmu:
                    {'\n'}- Urgent banget (harus banget), agak urgent (bisa menunggu), tidak urgent (bisa kapan-kapan atau dialihkan ke orang lain).
                    {'\n'}- Penting, agak penting, tidak penting (bisa diabaikan).
                </Text>

                <Text style={styles.desc}>
                    2. Jinakkan overthinking-mu:
                    {'\n'}"Tidak semua perlu dipikirkan. Pikirkan yang perlu saja."
                </Text>

                <Text style={styles.desc}>
                    3. Kenali batasanmu:
                    {'\n'}"Aku mahasiswa = manusia biasa yg sedang belajar. Karena sedang belajar, maka mistakes are welcome."
                    {'\n'}Kerjakan semampumu, sebisamu, dengan apa adamu.
                </Text>

                <Text style={styles.desc}>
                    4. Apresiasi usaha, bukan hanya hasil:
                    {'\n'}Karena hanya kamu yang tahu jatuh bangunmu. Bisikkan apresiasi ke dirimu, suarakan dalam batin betapa hebat dan kuatnya dirimu.
                    {'\n'}Jika orang lain mencercamu, abaikan. Telingamu bisa memilih apakah omongan itu sampah atau berkah.
                </Text>

                <Text style={styles.desc}>
                    5. Afirmasi & visualisasi sukses:
                    {'\n'}Jangan fokus pada ketakutan gagal. Visualisasikan keberhasilan dan afirmasi yang menguatkan.
                </Text>

                <Text style={styles.desc}>
                    Jika ingin mendapat feedback khusus, daftar konseling UPT LKDPDEM @undip.studentcare atau WA 0811-2500-5757.
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
        height: 300,
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
