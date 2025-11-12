// API Configuration & Dummy Data
// Centralized single source of truth for all data
// ini nanti bisa dihapus kalau udah connect ke backend beneran

// Dummy data mahasiswa - sesuai di semua screen
const MAHASISWA_DATA = [
{
    id: "1",
    nama: "Safira Septiandika Salsabila",
    nim: "21120122140147",
    whatsapp: "6281234567891",
    email: "safira@students.undip.ac.id",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Perempuan",
    foto: null,
    riwayat: [
    {
        id: "1-1",
        tanggal: "12-11-2025",
        depresi: "Sangat Berat",
        kecemasan: "Berat",
        stres: "Sangat Berat",
        depresiLevel: 4,
        kecemAsanLevel: 3,
        stresLevel: 4,
    },
    {
        id: "1-2",
        tanggal: "10-12-2024",
        depresi: "Ringan",
        kecemasan: "Ringan",
        stres: "Ringan",
        depresiLevel: 1,
        kecemAsanLevel: 1,
        stresLevel: 1,
    },
    ],
},
{
    id: "2",
    nama: "Syabina Kamila",
    nim: "21120122140132",
    whatsapp: "6281234567890",
    email: "syabina@students.undip.ac.id",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Perempuan",
    foto: null,
    riwayat: [
    {
        id: "2-1",
        tanggal: "10-11-2025",
        depresi: "Berat",
        kecemasan: "Sedang",
        stres: "Sangat Berat",
        depresiLevel: 3,
        kecemAsanLevel: 2,
        stresLevel: 4,
    },
    {
        id: "2-2",
        tanggal: "25-12-2024",
        depresi: "Sedang",
        kecemasan: "Sedang",
        stres: "Berat",
        depresiLevel: 2,
        kecemAsanLevel: 2,
        stresLevel: 3,
    },
    ],
},
{
    id: "3",
    nama: "Bagaskara Dipowicaksono HP",
    nim: "21120122140119",
    whatsapp: "6281298765432",
    email: "bagas@students.undip.ac.id",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Laki-laki",
    foto: null,
    riwayat: [
    {
        id: "3-1",
        tanggal: "11-11-2025",
        depresi: "Sangat Berat",
        kecemasan: "Ringan",
        stres: "Ringan",
        depresiLevel: 4,
        kecemAsanLevel: 1,
        stresLevel: 1,
    },
    {
        id: "3-2",
        tanggal: "05-12-2024",
        depresi: "Ringan",
        kecemasan: "Berat",
        stres: "Ringan",
        depresiLevel: 1,
        kecemAsanLevel: 3,
        stresLevel: 1,
    },
    ],
},
{
    id: "4",
    nama: "Bagus Panggalih",
    nim: "21120122140106",
    whatsapp: "081212345678",
    email: "bagus@students.undip.ac.id",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Laki-laki",
    foto: null,
    riwayat: [
    {
        id: "4-1",
        tanggal: "12-11-2025",
        depresi: "Sedang",
        kecemasan: "Berat",
        stres: "Sedang",
        depresiLevel: 2,
        kecemAsanLevel: 3,
        stresLevel: 2,
    },
    {
        id: "4-2",
        tanggal: "30-12-2024",
        depresi: "Berat",
        kecemasan: "Sedang",
        stres: "Sedang",
        depresiLevel: 3,
        kecemAsanLevel: 2,
        stresLevel: 2,
    },
    ],
},
]

// Level Keterangan
const LEVEL_KETERANGAN = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
}

// API Endpoints - Backend
export const API = {
getProfile: async () =>
    new Promise((resolve) => {
    setTimeout(() => resolve(MAHASISWA_DATA[0]), 500)
    }),

getAllMahasiswa: async () =>
    new Promise((resolve) => {
    setTimeout(() => resolve(MAHASISWA_DATA), 500)
    }),

getMahasiswaById: async (id) =>
    new Promise((resolve, reject) => {
    setTimeout(() => {
        const mahasiswa = MAHASISWA_DATA.find((m) => m.id === id)
        mahasiswa ? resolve(mahasiswa) : reject(new Error("Mahasiswa not found"))
    }, 500)
    }),

getRiwayatMahasiswa: async (id) =>
    new Promise((resolve, reject) => {
    setTimeout(() => {
        const mahasiswa = MAHASISWA_DATA.find((m) => m.id === id)
        mahasiswa
        ? resolve({
            id: mahasiswa.id,
            nama: mahasiswa.nama,
            nim: mahasiswa.nim,
            riwayat: mahasiswa.riwayat,
            })
        : reject(new Error("Mahasiswa not found"))
    }, 500)
    }),

getAllRiwayat: async () =>
    new Promise((resolve) => {
    setTimeout(() => {
        const allRiwayat = MAHASISWA_DATA.map((m) => ({
        id: m.id,
        nama: m.nama,
        nim: m.nim,
        tanggal: m.riwayat[0]?.tanggal || "-",
        riwayatDetail: m.riwayat,
        }))
        resolve(allRiwayat)
    }, 500)
    }),

getRiwayatById: async (id) =>
    new Promise((resolve, reject) => {
    setTimeout(() => {
        const [mahasiswaId] = id.split("-")
        const mahasiswa = MAHASISWA_DATA.find((m) => m.id === mahasiswaId)
        if (!mahasiswa) return reject(new Error("Mahasiswa not found"))
        const riwayat = mahasiswa.riwayat.find((r) => r.id === id)
        riwayat
        ? resolve({ ...riwayat, nama: mahasiswa.nama, nim: mahasiswa.nim })
        : reject(new Error("Riwayat not found"))
    }, 500)
    }),

getLevelKeterangan: (level) => LEVEL_KETERANGAN[level] || "Unknown",
getAllData: () => MAHASISWA_DATA,
}

export default API
