// API Configuration & Dummy Data
// Centralized single source of truth for all data
// ini nanti bisa dihapus kalau udah connect ke backend beneran

// Dummy data mahasiswa - sesuai di semua screen
// Dummy data mahasiswa - bisa dipakai untuk login, profile, dan riwayat

const MAHASISWA_DATA = [
{
    id: "1",
    nama: "Safira Septiandika Salsabila",
    nim: "21120122140147",
    password: "safira123",
    whatsapp: "6281229912499",
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
        kecemasanLevel: 3,
        stresLevel: 4,
    },
    ],
},
{
    id: "2",
    nama: "Syabina Kamila",
    nim: "21120122140132",
    password: "syabina123",
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
        kecemasanLevel: 2,
        stresLevel: 4,
    },
    ],
},
{
    id: "3",
    nama: "Bagaskara Dipowicaksono HP",
    nim: "21120122140119",
    password: "bagas123",
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
        kecemasanLevel: 1,
        stresLevel: 1,
    },
    ],
},
{
    id: "4",
    nama: "Bagus Panggalih",
    nim: "21120122140106",
    password: "bagus123",
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
        depresi: "Sangat Berat",
        kecemasan: "Sangat Berat",
        stres: "Sangat Berat",
        depresiLevel: 4,
        kecemasanLevel: 4,
        stresLevel: 4,
    },
    ],
},
];

// API simulasi
export const API = {
getAllMahasiswa: async () =>
    new Promise((resolve) => setTimeout(() => resolve(MAHASISWA_DATA), 300)),

getMahasiswaByNIM: async (nim) =>
    new Promise((resolve, reject) => {
    setTimeout(() => {
        const m = MAHASISWA_DATA.find((x) => x.nim === nim);
        m ? resolve(m) : reject(new Error("Mahasiswa tidak ditemukan"));
    }, 300);
    }),

login: async (nim, password) =>
    new Promise((resolve, reject) => {
    setTimeout(() => {
        const user = MAHASISWA_DATA.find(
        (m) => m.nim === nim && m.password === password
        );
        user
        ? resolve({ success: true, data: user })
        : reject(new Error("NIM atau password salah"));
    }, 300);
    }),
};

export default API;
