"use client"

import { useState, useMemo, useEffect } from "react"
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Modal,
TextInput,
ActivityIndicator,
Linking,
} from "react-native"
import Container from "../../components/container"
import Card from "../../components/card"
import API from "../../data/MahasiswaDummy"

export default function RiwayatPemantauanMahasiswaScreen() {
const [riwayatData, setRiwayatData] = useState([])
const [loading, setLoading] = useState(true)
const [sortOrder, setSortOrder] = useState("desc") // desc = terbaru dulu, asc = terlama dulu
const [searchQuery, setSearchQuery] = useState("")
const [selectedRiwayat, setSelectedRiwayat] = useState(null)
const [modalVisible, setModalVisible] = useState(false)

useEffect(() => {
    const fetchData = async () => {
    try {
        const data = await API.getAllRiwayat()
        // Urutkan dari terbaru ke terlama langsung di awal
        const sortedData = data.sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
        )
        setRiwayatData(sortedData)
    } catch (err) {
        console.error("Gagal ambil data:", err)
    } finally {
        setLoading(false)
    }
    }
    fetchData()
}, [])

const filteredRiwayat = useMemo(() => {
    let data = [...riwayatData]

    // Search
    if (searchQuery) {
    data = data.filter(
        (r) =>
        r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nim.includes(searchQuery)
    )
    }

    // Sort berdasarkan tanggal terbaru / terlama
    data.sort((a, b) =>
    sortOrder === "desc"
        ? new Date(b.tanggal) - new Date(a.tanggal)
        : new Date(a.tanggal) - new Date(b.tanggal)
    )

    return data
}, [riwayatData, sortOrder, searchQuery])

return (
    <Container scrollable={false}>
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

        {/* Sort Options */}
        <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Urutkan:</Text>

        <TouchableOpacity
            style={[
            styles.sortButton,
            sortOrder === "desc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortOrder("desc")}
        >
            <Text
            style={[
                styles.sortButtonText,
                sortOrder === "desc" && styles.sortButtonTextActive,
            ]}
            >
            🔽 Terbaru
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
            styles.sortButton,
            sortOrder === "asc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortOrder("asc")}
        >
            <Text
            style={[
                styles.sortButtonText,
                sortOrder === "asc" && styles.sortButtonTextActive,
            ]}
            >
            🔼 Terlama
            </Text>
        </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
            <ActivityIndicator size="large" color="#534DD9" />
        </View>
        ) : (
        <Card title={`Riwayat Pemantauan (${filteredRiwayat.length})`}>
            {filteredRiwayat.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Tidak ada riwayat yang ditemukan</Text>
            </View>
            ) : (
            <View>
                {/* Header Tabel */}
                <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.nameCell]}>Nama</Text>
                <Text style={[styles.tableCell, styles.dateCell]}>
                    Tanggal Pemantauan
                </Text>
                <Text style={[styles.tableCell, styles.actionCell]}>Detail</Text>
                </View>

                {/* Isi Tabel */}
                {filteredRiwayat.map((riwayat) => (
                <TouchableOpacity
                    key={riwayat.id}
                    style={styles.tableRow}
                    onPress={() => {
                    setSelectedRiwayat(riwayat)
                    setModalVisible(true)
                    }}
                >
                    <Text style={[styles.tableCell, styles.nameCell]}>
                    {riwayat.nama}
                    </Text>
                    <Text style={[styles.tableCell, styles.dateCell]}>
                    {riwayat.tanggal}
                    </Text>
                    <Text
                    style={[styles.tableCell, styles.actionCell, styles.actionText]}
                    >
                    Buka
                    </Text>
                </TouchableOpacity>
                ))}
            </View>
            )}
        </Card>
        )}
    </ScrollView>

    {/* Modal Detail Riwayat */}
    <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            {selectedRiwayat && (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                >
                <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>
                Riwayat Pemantauan {selectedRiwayat.nama}
                </Text>

                <View style={styles.modalInfoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nama:</Text>
                    <Text style={styles.infoValue}>{selectedRiwayat.nama}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>NIM:</Text>
                    <Text style={styles.infoValue}>{selectedRiwayat.nim}</Text>
                </View>
                </View>

                {/* Kontak */}
                <View style={{ marginTop: 15 }}>
                {/* WhatsApp */}
                <TouchableOpacity
                    style={{
                    backgroundColor: "#25D366",
                    padding: 10,
                    borderRadius: 6,
                    marginBottom: 10,
                    alignItems: "center",
                    }}
                    onPress={() => {
                    const waNumber = "+628123456789"; // ganti dengan nomor mahasiswa
                    Linking.openURL(`https://wa.me/${waNumber}`);
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Chat WA</Text>
                </TouchableOpacity>

                {/* Email */}
                <TouchableOpacity
                    style={{
                    backgroundColor: "#534DD9",
                    padding: 10,
                    borderRadius: 6,
                    alignItems: "center",
                    marginBottom: 20,
                    }}
                    onPress={() => {
                    const email = "mahasiswa@email.com"; // ganti dengan email mahasiswa
                    Linking.openURL(`mailto:${email}`);
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Kirim Email</Text>
                </TouchableOpacity>
                </View>

                {/* Detail Riwayat Pemantauan */}
                <Card title="Detail Pemantauan">
                {selectedRiwayat.riwayatDetail
                    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                    .map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                        <Text style={styles.detailDate}>
                        Tanggal: {detail.tanggal}
                        </Text>
                        <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>
                            Depresi: {detail.depresi} (Level {detail.depresiLevel})
                        </Text>
                        <Text style={styles.detailLabel}>
                            Kecemasan: {detail.kecemasan} (Level{" "}
                            {detail.kecemAsanLevel})
                        </Text>
                        <Text style={styles.detailLabel}>
                            Stres: {detail.stres} (Level {detail.stresLevel})
                        </Text>
                        </View>
                    </View>
                    ))}
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
scrollContainer: { paddingBottom: 30 },
searchContainer: { marginBottom: 15 },
searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
},
sortContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
sortLabel: { fontSize: 14, fontWeight: "600", marginRight: 10, color: "#333" },
sortButton: {
    backgroundColor: "#E9E8FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
},
sortButtonActive: { backgroundColor: "#534DD9" },
sortButtonText: { color: "#041062", fontSize: 13, fontWeight: "500" },
sortButtonTextActive: { color: "#fff" },
emptyContainer: { alignItems: "center", paddingVertical: 30 },
emptyText: { color: "#999", fontSize: 14 },
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
tableCell: { fontSize: 13, color: "#333" },
nameCell: { flex: 1.5 },
dateCell: { flex: 1.5 },
actionCell: { flex: 0.7, textAlign: "center" },
actionText: { color: "#534DD9", fontWeight: "600" },
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
modalScrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
closeButton: { alignItems: "flex-end", marginBottom: 10 },
closeButtonText: { fontSize: 24, color: "#999", fontWeight: "bold" },
modalTitle: { fontSize: 20, fontWeight: "bold", color: "#041062", marginBottom: 15 },
modalInfoContainer: { marginBottom: 20 },
infoRow: { flexDirection: "row", marginBottom: 12 },
infoLabel: { fontSize: 14, fontWeight: "600", color: "#041062", width: 100 },
infoValue: { fontSize: 14, color: "#555", flex: 1 },
detailItem: {
    backgroundColor: "#F4F4FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#534DD9",
},
detailDate: { fontWeight: "bold", color: "#041062", marginBottom: 8 },
detailLabel: { fontSize: 13, marginBottom: 4, color: "#333" },
})