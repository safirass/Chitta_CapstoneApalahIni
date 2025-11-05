import React, { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Image,
Alert,
KeyboardAvoidingView,
Platform,
ScrollView,
} from "react-native";

export default function LoginScreen({ navigation, setIsLoggedIn }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
    Alert.alert("Peringatan", "Email dan Password tidak boleh kosong!");
    } else {
    Alert.alert("Sukses", `Login berhasil untuk ${email}`);
    console.log("Login dengan Email:", email);
    console.log("Password:", password);
    setIsLoggedIn(true);
    }
};

return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
    >
        {/* Logo */}
        <Image
        source={require("../../assets/chitta.png")}
        style={styles.logo}
        resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>LOG IN</Text>
        <Text style={styles.subtitle}>
        Selamat datang kembali! Silakan masuk untuk melanjutkan.
        </Text>

        {/* Input Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
        style={styles.input}
        placeholder="Masukkan Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        />

        {/* Input Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
        style={styles.input}
        placeholder="Masukkan Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        />

        {/* Lupa Password */}
        <Text style={styles.forgot} 
        // onPress={() => navigation.navigate("forgot")}
        >
            Lupa Password
        </Text>

        {/* Tombol Login */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Link ke Register */}
        <Text style={styles.footer}>
        Belum memiliki akun?{" "}
        <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
        >
            Daftar di sini
        </Text>
        </Text>
    </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FE",
    padding: 20,
},
logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
},
title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
},
subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
},
label: {
    alignSelf: "flex-start",
    marginLeft: 30,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
},
input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
},
forgot: {
    alignSelf: "flex-end",
    marginRight: 30,
    marginBottom: 15,
    color: "#5A67D8",
    fontSize: 13,
},
button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
},
footer: {
    fontSize: 14,
    color: "#333",
},
link: {
    color: "#5A67D8",
    fontWeight: "500",
},
});





// // INI BUAT LOGIN SAMA ADMINNYA
// import React, { useState } from "react";
// import {
// View,
// Text,
// TextInput,
// TouchableOpacity,
// StyleSheet,
// Image,
// Alert,
// KeyboardAvoidingView,
// Platform,
// ScrollView,
// } from "react-native";

// export default function LoginScreen({ navigation, setIsLoggedIn, setUserRole }) {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleLogin = () => {
//         const adminEmail = "admin@chitta.com";
//         const adminPassword = "admin123";
//         const userEmail = "mahasiswa@chitta.com";
//         const userPassword = "user123";

//         if (email === adminEmail && password === adminPassword) {
//         setIsLoggedIn(true);
//         setUserRole("admin"); // simpan role admin
//         navigation.replace("AdminHome");
//         return;
//         }

//         if (email === userEmail && password === userPassword) {
//         setIsLoggedIn(true);
//         setUserRole("user"); // simpan role user
//         navigation.replace("Home");
//         return;
//         }

//         Alert.alert("Login Gagal", "Email atau password salah!");
//     };

// return (
//     <KeyboardAvoidingView
//     style={{ flex: 1 }}
//     behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//     <ScrollView
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//     >
//         {/* Logo */}
//         <Image
//         source={require("../../assets/chitta.png")}
//         style={styles.logo}
//         resizeMode="contain"
//         />

//         {/* Title */}
//         <Text style={styles.title}>LOG IN</Text>
//         <Text style={styles.subtitle}>
//         Selamat datang kembali! Silakan masuk untuk melanjutkan.
//         </Text>

//         {/* Input Email */}
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//         style={styles.input}
//         placeholder="Masukkan Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         />

//         {/* Input Password */}
//         <Text style={styles.label}>Password</Text>
//         <TextInput
//         style={styles.input}
//         placeholder="Masukkan Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         />

//         {/* Lupa Password */}
//         <Text
//         style={styles.forgot}
//         // onPress={() => navigation.navigate("forgot")}
//         >
//         Lupa Password
//         </Text>

//         {/* Tombol Login */}
//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>LOGIN</Text>
//         </TouchableOpacity>

//         {/* Link ke Register */}
//         <Text style={styles.footer}>
//         Belum memiliki akun?{" "}
//         <Text
//             style={styles.link}
//             onPress={() => navigation.navigate("Register")}
//         >
//             Daftar di sini
//         </Text>
//         </Text>
//     </ScrollView>
//     </KeyboardAvoidingView>
// );
// }

// const styles = StyleSheet.create({
// container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8F9FE",
//     padding: 20,
// },
// logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
// },
// title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#000",
//     textAlign: "center",
// },
// subtitle: {
//     fontSize: 13,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 20,
// },
// label: {
//     alignSelf: "flex-start",
//     marginLeft: 30,
//     marginBottom: 5,
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#333",
// },
// input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#5A67D8",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     backgroundColor: "#fff",
// },
// forgot: {
//     alignSelf: "flex-end",
//     marginRight: 30,
//     marginBottom: 15,
//     color: "#5A67D8",
//     fontSize: 13,
// },
// button: {
//     backgroundColor: "#5A67D8",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 10,
//     elevation: 3,
//     marginBottom: 15,
// },
// buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
// },
// footer: {
//     fontSize: 14,
//     color: "#333",
// },
// link: {
//     color: "#5A67D8",
//     fontWeight: "500",
// },
// });
