import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BreathingScreen() {
return (
<View style={styles.container}>
    <Text style={styles.title}>Dengarkan Musik Relaksasi</Text>
    <Text>Halaman untuk musik relaksasi.</Text>
</View>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#EFECFE", },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
