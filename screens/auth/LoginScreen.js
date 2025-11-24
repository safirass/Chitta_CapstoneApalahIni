import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { sleepDataService } from "../../utils/sleepDataService";

export default function LoginScreen({ navigation, setIsLoggedIn, setUserRole, setUserData }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://10.0.2.2:8000/api";

  const dummyUsers = [
    {
      id: "1",
      password: "1",
      nama: "Safira Septiandika Salsabila",
      role: "user",
    },
    {
      id: "2",
      password: "2",
      nama: "Admin UPT LKDPDEM",
      role: "admin",
    },
  ];

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert("Peringatan", "Silakan isi Username/NIM/NIP dan Password terlebih dahulu!");
      return;
    }

    setLoading(true);

    try {
      // First check if it's a dummy user
      const dummyUser = dummyUsers.find((u) => u.id === id && u.password === password);

      if (dummyUser) {
        // Dummy login - try HCGateway as bonus
        let hcGatewayToken = null;
        let hcGatewayUserId = null;
        
        try {
          const hcGatewayAuth = await sleepDataService.loginToHCGateway(id, password);
          hcGatewayToken = hcGatewayAuth.token;
          hcGatewayUserId = hcGatewayAuth.userId;
          console.log("✅ HCGateway login successful");
        } catch (hcError) {
          console.warn("⚠️ HCGateway login skipped (optional):", hcError.message);
        }

        Alert.alert("Login Berhasil", `Selamat datang, ${dummyUser.nama}`);
        
        setIsLoggedIn(true);
        setUserRole(dummyUser.role);
        setUserData({
          ...dummyUser,
          hcGatewayToken: hcGatewayToken,
          hcGatewayUserId: hcGatewayUserId,
        });
        
        setLoading(false);
        return;
      }

      // Not a dummy user - try HCGateway first
      console.log("Trying HCGateway login with:", id);
      
      let hcGatewayToken = null;
      let hcGatewayUserId = null;
      let hcGatewayLoginSuccess = false;

      try {
        const hcGatewayAuth = await sleepDataService.loginToHCGateway(id, password);
        hcGatewayToken = hcGatewayAuth.token;
        hcGatewayUserId = hcGatewayAuth.userId;
        hcGatewayLoginSuccess = true;
        console.log("✅ HCGateway login successful");

        // If HCGateway login succeeds, use that
        Alert.alert("Login Berhasil", `Selamat datang!`);
        
        setIsLoggedIn(true);
        setUserRole("user");
        setUserData({
          id: id,
          nama: id,
          role: "user",
          token: null,
          hcGatewayToken: hcGatewayToken,
          hcGatewayUserId: hcGatewayUserId,
        });
        
        setLoading(false);
        return;
      } catch (hcError) {
        console.warn("⚠️ HCGateway login failed:", hcError.message);
      }

      // HCGateway failed, try backend
      console.log("Trying backend login...");
      
      try {
        const payload =
          id.length > 5
            ? { nim: id, password }
            : { nip: id, password };

        const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
        const { data } = res.data;

        Alert.alert("Berhasil", `Selamat datang, ${data.nama}!`);

        setIsLoggedIn(true);
        setUserRole(data.role || "user");
        setUserData({
          id: data.nim || data.nip,
          nama: data.nama,
          role: data.role,
          token: data.token || null,
          hcGatewayToken: hcGatewayToken,
          hcGatewayUserId: hcGatewayUserId,
        });

      } catch (backendError) {
        console.error("Backend login also failed:", backendError.message);
        
        if (!hcGatewayLoginSuccess) {
          Alert.alert(
            "Login Gagal",
            "Username/password tidak valid.\n\nGunakan:\n• Dummy: 1/1 atau 2/2\n• HCGateway: Username yang sudah terdaftar\n• Backend: Jika server tersedia"
          );
        }
      }

    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", "Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
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
          Masukkan Username / NIM (Mahasiswa) atau NIP (Admin) dan Password untuk melanjutkan.
        </Text>

        {/* Input NIM/NIP */}
        <TextInput
          style={styles.input}
          placeholder="Masukkan Username / NIM / NIP"
          value={id}
          onChangeText={setId}
          keyboardType="default"
          autoCapitalize="none"
          editable={!loading}
        />

        {/* Input Password */}
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />

        {/* Lupa Password */}
        <Text
          style={styles.forgot}
          onPress={() => !loading && navigation.navigate("ForgotPassword")}
        >
          Lupa Password?
        </Text>

        {/* Tombol Login */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#534DD9"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        )}

        {/* Help Text */}
        <Text style={styles.helpText}>
          Test Credentials:{"\n"}
          Dummy: username "1", password "1"{"\n"}
          HCGateway: your registered username
        </Text>

        {/* Link ke Register */}
        <Text style={styles.footer}>
          Belum memiliki akun?{" "}
          <Text
            style={styles.link}
            onPress={() => !loading && navigation.navigate("Register")}
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
  logo: { width: 120, height: 120, marginBottom: 20 },
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
    color: "#000",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  forgot: {
    alignSelf: "flex-end",
    marginRight: 10,
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  helpText: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  footer: { fontSize: 14, color: "#000" },
  link: { color: "#5A67D8", fontWeight: "500" },
});