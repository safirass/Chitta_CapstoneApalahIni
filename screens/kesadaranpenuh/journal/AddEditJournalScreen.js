import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddEditJournalScreen({ route, navigation }) {
const { onSave, journal } = route.params || {};
const [title, setTitle] = useState(journal ? journal.title : '');
const [content, setContent] = useState(journal ? journal.content : '');
const [image, setImage] = useState(journal ? journal.image : null);

// 🗓️ Ambil tanggal otomatis (format Indonesia)
const today = new Date();
const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ 
    mediaTypes: ImagePicker.MediaTypeOptions.Images 
    });
    if (!result.canceled) setImage(result.assets[0].uri);
};

const saveJournal = () => {
    const newJournal = {
    id: journal ? journal.id : Date.now().toString(),
    title: title || 'Tanpa Judul',
    date: formattedDate, // ← pakai tanggal otomatis
    content,
    image: image || 'https://via.placeholder.com/150',
    };
    onSave(newJournal);
    navigation.goBack();
};

return (
    <View style={styles.container}>
    <Text style={styles.date}>{formattedDate}</Text>

    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
        <Image source={{ uri: image }} style={styles.image} />
        ) : (
        <Text style={styles.addImageText}>+ Tambahkan gambar</Text>
        )}
    </TouchableOpacity>

    <TextInput
        placeholder="Judul"
        value={title}
        onChangeText={setTitle}
        style={styles.inputTitle}
    />

    <TextInput
        placeholder="Tulis isi di sini"
        value={content}
        onChangeText={setContent}
        style={styles.inputContent}
        multiline
    />

    <TouchableOpacity style={styles.saveButton} onPress={saveJournal}>
        <Text style={styles.saveText}>Selesai</Text>
    </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 16, backgroundColor: '#F2F4FF' },
date: { color: '#777', marginBottom: 8, textAlign: 'right' },
imagePicker: {
    backgroundColor: '#E9E8FF',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
},
image: { width: '100%', height: '100%', borderRadius: 12 },
addImageText: { color: '#041062' },
inputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
},
inputContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
},
saveButton: {
    marginTop: 20,
    backgroundColor: '#041062',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
},
saveText: { color: '#fff', fontWeight: 'bold' },
});
