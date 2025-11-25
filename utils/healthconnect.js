// import {
// requestPermission,
// Permission,
// initialize
// } from "expo-health-connect";
// import { Platform } from "react-native";

// export async function requestHealthPermissions() {
// try {
//     if (Platform.OS !== "android") {
//     console.log("Health Connect hanya berjalan di Android");
//     return false;
//     }

//     const ok = await initialize();
//     if (!ok) {
//     console.log("Health Connect tidak tersedia di perangkat");
//     return false;
//     }

//     const granted = await requestPermission([
//     Permission.ReadSleepSession,
//     Permission.ReadHeartRate,
//     Permission.ReadStress,
//     ]);

//     return granted;
// } catch (e) {
//     console.log("Error requesting permissions", e);
//     return false;
// }
// }
