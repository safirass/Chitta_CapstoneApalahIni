import {
requestPermission,
Permission,
initialize
} from "expo-health-connect";

export async function requestHealthPermissions() {
try {
    const ok = await initialize();
    if (!ok) return console.log("Health Connect tidak tersedia");

    const granted = await requestPermission([
    Permission.ReadSleepSession,
    Permission.ReadHeartRate,
    Permission.ReadStress,
    ]);

    return granted;
} catch (e) {
    console.log("Error requesting permissions", e);
    return false;
}
}
