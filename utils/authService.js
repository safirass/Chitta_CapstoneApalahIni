// // utils/authService.js
// // Contoh sederhana menggunakan fetch. Sesuaikan BASE_URL dengan backend kalian.
// // Menggunakan named export `authService` supaya import { authService } dari LoginScreen bekerja.

// const BASE_URL = 'https://api.example.com'; // GANTI dengan URL backend kalian

// export const authService = {
// // Login dengan NIM / NIP + password
// loginWithNim: async (nim, password) => {
//     try {
//     const res = await fetch(`${BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//         username: nim, // kalau backend mengharapkan 'nim' ganti sesuai kebutuhan
//         password,
//         // optional: type: 'nim'
//         }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//         // pastikan backend mengirim message pada error body
//         throw new Error(data.message || `Login failed (${res.status})`);
//     }

//     // Contoh struktur response yang diharapkan:
//     // {
//     //   token: "...",
//     //   refreshToken: "...",
//     //   expiry: 1690000000,
//     //   userId: "123",
//     //   role: "mahasiswa",
//     //   nama: "Budi",
//     //   hcGatewayToken: null
//     // }

//     return {
//         token: data.token,
//         refreshToken: data.refreshToken,
//         expiry: data.expiry,
//         userId: data.userId,
//         role: data.role,
//         nama: data.nama,
//         hcGatewayToken: data.hcGatewayToken,
//     };
//     } catch (err) {
//     console.error('authService.loginWithNim error', err);
//     // Re-throw supaya komponen yang memanggil bisa menampilkan Alert
//     throw err;
//     }
// },

// // Placeholder untuk refresh token (opsional)
// refreshToken: async (refreshToken) => {
//     try {
//     const res = await fetch(`${BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || 'Refresh token failed');
//     return data; // token baru dsb.
//     } catch (err) {
//     console.error('authService.refreshToken error', err);
//     throw err;
//     }
// },
// };