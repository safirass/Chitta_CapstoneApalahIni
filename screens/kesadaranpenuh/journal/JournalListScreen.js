import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function JournalListScreen({ navigation }) {
const [journals, setJournals] = useState([
    {
    id: '1',
    title: 'Jurnal Hari Ini',
    date: '3 Januari 2025',
    image: 'https://i.pinimg.com/736x/f2/53/f5/f253f579b60285e77d5b444f423ddcc3.jpg',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
]);

const addJournal = (newJournal) => {
    setJournals([newJournal, ...journals]);
};

return (
    <View style={styles.container}>
    <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditJournal', { onSave: addJournal })}
    >
        <Text style={styles.addText}>+ Tambah Jurnal</Text>
    </TouchableOpacity>

    <Text style={styles.sectionTitle}>Jurnal Harian</Text>
    <FlatList
        data={journals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('JournalDetail', { journal: item, onUpdate: setJournals })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text numberOfLines={1} style={styles.preview}>{item.content}</Text>
            </View>
        </TouchableOpacity>
        )}
    />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 16, backgroundColor: '#F2F4FF' },
addButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
},
addText: { fontSize: 18, fontWeight: 'bold', color: '#041062' },
desc: { fontSize: 12, color: '#777' },
sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
},
image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
textContainer: { flex: 1 },
title: { fontWeight: 'bold', fontSize: 14 },
date: { color: '#777', fontSize: 12 },
preview: { color: '#555', fontSize: 12 },
});
