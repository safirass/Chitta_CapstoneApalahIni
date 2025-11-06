"use client"

import { useState, useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native"
import Container from "../../components/container"
import Card from "../../components/card"
import { UNDIP_DATA } from "../../data/FakultasJurusan"

// Data dummy mahasiswa
const DUMMY_MAHASISWA = [
{
    id: "1",
    nama: "Budi Santoso",
    nim: "21120122140001",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Laki-laki",
    foto: null,
},
{
    id: "2",
    nama: "Siti Nurhaliza",
    nim: "21120122130002",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Sipil",
    semester: "6",
    jenisKelamin: "Perempuan",
    foto: null,
},
{
    id: "3",
    nama: "Ahmad Rizki",
    nim: "21120122140003",
    fakultas: "Fakultas Psikologi",
    jurusan: "Psikologi (S1)",
    semester: "5",
    jenisKelamin: "Laki-laki",
    foto: null,
},
{
    id: "4",
    nama: "Dewi Kusuma",
    nim: "21120122130004",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Elektro",
    semester: "7",
    jenisKelamin: "Perempuan",
    foto: null,
},
{
    id: "5",
    nama: "Riyanto Wijaya", 
    nim: "21120122140005",
    fakultas: "Fakultas Kedokteran",
    jurusan: "Kedokteran (S1)",
    semester: "4",
    jenisKelamin: "Laki-laki",
    foto: null,
},
]

export default function DaftarMahasiswaDetailScreen() {
const [selectedFakultas, setSelectedFakultas] = useState("Fakultas Teknik")
const [sortBy, setSortBy] = useState("nama") // "nama" atau "nim"
const [searchQuery, setSearchQuery] = useState("")
const [selectedMahasiswa, setSelectedMahasiswa] = useState(null)
const [modalVisible, setModalVisible] = useState(false)

// Filter dan sort data
const filteredMahasiswa = useMemo(() => {
    let data = DUMMY_MAHASISWA.filter((m) => m.fakultas === selectedFakultas)

    // Search
    if (searchQuery) {
    data = data.filter((m) => m.nama.toLowerCase().includes(searchQuery.toLowerCase()) || m.nim.includes(searchQuery))
    }

    // Sort
    data.sort((a, b) => {
    if (sortBy === "nama") {
        return a.nama.localeCompare(b.nama)
    } else {
        return a.nim.localeCompare(b.nim)
    }
    })

    return data
}, [selectedFakultas, sortBy, searchQuery])

const fakultasList = Object.keys(UNDIP_DATA)

return (
    <Container>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau NIM..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
        />
        </View>

        {/* Filter Fakultas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fakultasSelector}>
        {fakultasList.map((fakultas) => (
            <TouchableOpacity
            key={fakultas}
            style={[styles.fakultasButton, selectedFakultas === fakultas && styles.fakultasButtonActive]}
            onPress={() => {
                setSelectedFakultas(fakultas)
                setSearchQuery("")
            }}
            >
            <Text style={[styles.fakultasText, selectedFakultas === fakultas && styles.fakultasTextActive]}>
                {fakultas.replace("Fakultas ", "")}
            </Text>
            </TouchableOpacity>
        ))}
        </ScrollView>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Urutkan:</Text>
        <TouchableOpacity
            style={[styles.sortButton, sortBy === "nama" && styles.sortButtonActive]}
            onPress={() => setSortBy("nama")}
        >
            <Text style={[styles.sortButtonText, sortBy === "nama" && styles.sortButtonTextActive]}>Nama</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.sortButton, sortBy === "nim" && styles.sortButtonActive]}
            onPress={() => setSortBy("nim")}
        >
            <Text style={[styles.sortButtonText, sortBy === "nim" && styles.sortButtonTextActive]}>NIM</Text>
        </TouchableOpacity>
        </View>

        {/* Tabel Mahasiswa */}
        <Card title={`${selectedFakultas} (${filteredMahasiswa.length} mahasiswa)`}>
        {filteredMahasiswa.length === 0 ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada mahasiswa yang ditemukan</Text>
            </View>
        ) : (
            <View>
            {/* Header Tabel */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.nameCell]}>Nama</Text>
                <Text style={[styles.tableCell, styles.nimCell]}>NIM</Text>
                <Text style={[styles.tableCell, styles.actionCell]}>Aksi</Text>
            </View>

            {/* Isi Tabel */}
            {filteredMahasiswa.map((mahasiswa) => (
                <TouchableOpacity
                key={mahasiswa.id}
                style={styles.tableRow}
                onPress={() => {
                    setSelectedMahasiswa(mahasiswa)
                    setModalVisible(true)
                }}
                >
                <Text style={[styles.tableCell, styles.nameCell]}>{mahasiswa.nama}</Text>
                <Text style={[styles.tableCell, styles.nimCell]}>{mahasiswa.nim}</Text>
                <Text style={[styles.tableCell, styles.actionCell, styles.actionText]}>Lihat</Text>
                </TouchableOpacity>
            ))}
            </View>
        )}
        </Card>
    </ScrollView>

    {/* Modal Detail */}
    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            {selectedMahasiswa && (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Detail Mahasiswa</Text>

                {/* Foto */}
                <View style={styles.fotoContainer}>
                <View style={[styles.fotoPlaceholder, { backgroundColor: "#E0E0E0" }]} />
                </View>

                {/* Info Mahasiswa */}
                <View style={styles.modalInfoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nama:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.nama}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>NIM:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.nim}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Jurusan:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.jurusan}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fakultas:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.fakultas}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Semester:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.semester}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Jenis Kelamin:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.jenisKelamin}</Text>
                </View>
                </View>

                {/* Riwayat Pemantauan */}
                <Card title="Riwayat Pemantauan Terbaru">
                <View style={styles.historyItem}>
                    <Text style={styles.historyDate}>15 Januari 2025</Text>
                    <Text style={styles.historyText}>Depresi: Sedang | Kecemasan: Ringan | Stres: Sedang</Text>
                </View>
                <View style={styles.historyItem}>
                    <Text style={styles.historyDate}>10 Januari 2025</Text>
                    <Text style={styles.historyText}>Depresi: Ringan | Kecemasan: Sedang | Stres: Ringan</Text>
                </View>
                </Card>
            </ScrollView>
            )}
        </View>
        </View>
    </Modal>
    </Container>
)
}

const styles = StyleSheet.create({
scrollContainer: {
    paddingBottom: 30,
},
searchContainer: {
    marginBottom: 15,
},
searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
},
fakultasSelector: {
    flexDirection: "row",
    paddingVertical: 10,
    marginBottom: 10,
},
fakultasButton: {
    backgroundColor: "#E9E8FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
},
fakultasButtonActive: {
    backgroundColor: "#534DD9",
},
fakultasText: {
    color: "#041062",
    fontSize: 13,
    fontWeight: "500",
},
fakultasTextActive: {
    color: "#fff",
},
sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
},
sortLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    color: "#333",
},
sortButton: {
    backgroundColor: "#E9E8FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
},
sortButtonActive: {
    backgroundColor: "#534DD9",
},
sortButtonText: {
    color: "#041062",
    fontSize: 13,
    fontWeight: "500",
},
sortButtonTextActive: {
    color: "#fff",
},
emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
},
emptyText: {
    color: "#999",
    fontSize: 14,
},
tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
},
tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
},
tableCell: {
    fontSize: 13,
    color: "#333",
},
nameCell: {
    flex: 2,
},
nimCell: {
    flex: 1.5,
    textAlign: "center",
},
actionCell: {
    flex: 1,
    textAlign: "center",
},
actionText: {
    color: "#534DD9",
    fontWeight: "600",
},
// Modal Styles
modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
},
modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingTop: 20,
},
modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
},
closeButton: {
    alignItems: "flex-end",
    marginBottom: 10,
},
closeButtonText: {
    fontSize: 24,
    color: "#999",
    fontWeight: "bold",
},
modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 15,
},
fotoContainer: {
    alignItems: "center",
    marginBottom: 20,
},
fotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
},
modalInfoContainer: {
    marginBottom: 20,
},
infoRow: {
    flexDirection: "row",
    marginBottom: 12,
},
infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#041062",
    width: 100,
},
infoValue: {
    fontSize: 14,
    color: "#555",
    flex: 1,
},
historyItem: {
    backgroundColor: "#F4F4FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#534DD9",
},
historyDate: {
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 4,
},
historyText: {
    color: "#555",
    fontSize: 13,
},
})
