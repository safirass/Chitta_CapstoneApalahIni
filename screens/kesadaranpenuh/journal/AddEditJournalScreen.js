/**
 * The `AddEditJournalScreen` function in React Native allows users to add or edit journal entries with
 * a title, content, and optional image selection.
 * @returns The `AddEditJournalScreen` component is being returned. It contains a form for adding or
 * editing a journal entry. The user can input a title, content, and optionally add an image. The
 * current date is displayed at the top of the form. There is a button to pick an image from the
 * device's library, input fields for title and content, and a button to save the journal entry
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Container from "../../../components/container";
import Card from "../../../components/card";

export default function AddEditJournalScreen({ route, navigation }) {
  const { onSave, journal } = route.params || {};
  const [title, setTitle] = useState(journal ? journal.title : "");
  const [isi_jurnal, setContent] = useState(journal ? journal.isi_jurnal : ""); // isi jurnal

  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  const saveJournal = () => {
    const newJournal = {
      id: journal ? journal.id : Date.now().toString(),
      title: title || "Tanpa Judul",
      date: formattedDate,
      isi_jurnal,
    };
    onSave(newJournal);
    navigation.goBack();
  };

  return (
    <Container >
      <Card>
        <Text style={styles.date}>{formattedDate}</Text>

        <TextInput
          placeholder="Judul"
          value={title}
          onChangeText={setTitle}
          style={styles.inputTitle}
        />

        <TextInput
          placeholder="Tulis isi di sini"
          value={isi_jurnal}
          onChangeText={setContent}
          style={styles.inputContent}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveJournal}>
          <Text style={styles.saveText}>Selesai</Text>
        </TouchableOpacity>
      </Card>
    </Container>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  date: {
    color: "#777",
    marginBottom: 8,
    textAlign: "right",
  },
  imagePicker: {
    backgroundColor: "#E9E8FF",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: screenWidth * 0.5, // tinggi setengah dari lebar layar, proporsional
    borderRadius: 12,
  },
  addImageText: { color: "#041062", fontWeight: "600", padding: 20 },

  inputTitle: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  inputContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    height: 200,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#041062",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
