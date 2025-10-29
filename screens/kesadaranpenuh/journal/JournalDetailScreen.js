import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function JournalDetailScreen({ route, navigation }) {
const { journal, onUpdate } = route.params;

return (
    <ScrollView style={styles.container}>
    <Text style={styles.date}>{journal.date}</Text>
    <Image source={{ uri: journal.image }} style={styles.image} />
    <Text style={styles.title}>{journal.title}</Text>
    <Text style={styles.content}>{journal.content}</Text>

    <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
        navigation.navigate('AddEditJournal', {
            journal,
            onSave: (updatedJournal) => {
            onUpdate((prev) =>
                prev.map((j) => (j.id === updatedJournal.id ? updatedJournal : j))
            );
            navigation.goBack();
            },
        })
        }
    >
        <Text style={styles.editText}>Edit</Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 16, backgroundColor: '#F2F4FF' },
date: { color: '#777', marginBottom: 8 },
image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
content: { fontSize: 14, lineHeight: 20 },
editButton: {
    backgroundColor: '#041062',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
},
editText: { color: '#fff', fontWeight: 'bold' },
});
