import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { sleepDataService } from '../../utils/sleepDataService';
import { hourlyPredictionService } from '../../utils/hourlyPredictionService';

/*
  Perubahan kecil:
  - Selamat datang sekarang menampilkan nama pengguna (bukan NIM) untuk kedua jalur:
    dummy dan HCGateway.
  - Jika HCGateway tidak mengembalikan nama, akan fallback ke username (NIM).
*/

const dummyUsers = [
  // mahasiswa (login dengan NIM)
  { nim: '21120122140119', nama: 'Bagas', password: '12345678', role: 'user' },
  { nim: '11', nama: 'Andi', password: 'password123', role: 'user' },

  // admin (login dengan NIP)
  { nip: '2001', nama: 'Admin UPT', password: 'admin123', role: 'admin' },
];

export default function LoginScreen({
  navigation,
  setIsLoggedIn,
  setUserRole,
  setUserData,
  setHCGatewayToken,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('hcgateway');

  // Handle Dummy Login (for testing)
  const handleDummyLogin = async () => {
    try {
      setLoading(true);

      if (!username || !password) {
        Alert.alert('Error', 'Please enter username and password');
        return;
      }

      // Try match as nim (mahasiswa)
      let user = dummyUsers.find(
        (u) => u.nim && u.nim === username && u.password === password
      );

      // If not found, try match as nip (admin)
      if (!user) {
        user = dummyUsers.find(
          (u) => u.nip && u.nip === username && u.password === password
        );
      }

      if (!user) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }

      // Use user's real name from dummy
      Alert.alert('Login Berhasil', `Selamat datang, ${user.nama}!`);

      setIsLoggedIn(true);
      setUserRole(user.role);
      const userData = {
        id: user.nim || user.nip || user.id,
        nama: user.nama,
        role: user.role,
        loginMethod: 'dummy',
      };
      setUserData(userData);

      // NAVIGATE TO HOME with userData
      navigation.replace('Home', { userData });

      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle HCGateway Login
  const handleHCGatewayLogin = async () => {
    try {
      setLoading(true);

      if (!username || !password) {
        Alert.alert('Error', 'Masukkan username dan password');
        return;
      }

      console.log('\n' + '='.repeat(50));
      console.log(' HCGATEWAY LOGIN');
      console.log('='.repeat(50));
      console.log(` Username: ${username}`);

      // Step 1: Login to HCGateway
      console.log('\nStep 1️: Authenticating with HCGateway...');
      const hcGatewayAuth = await sleepDataService.loginToHCGateway(
        username,
        password
      );

      if (!hcGatewayAuth || !hcGatewayAuth.token) {
        throw new Error('Invalid HCGateway response');
      }

      const { token, userId, refreshToken, expiry } = hcGatewayAuth;
      console.log(' HCGateway authentication successful');
      console.log(`   Token: ${token.substring(0, 20)}...`);
      console.log(`   User ID: ${userId}`);

      // Prefer the real name if returned by HCGateway (common keys: nama / name)
      const displayName = hcGatewayAuth?.nama || hcGatewayAuth?.name || username;

      // Step 2: Show success and login (pakai displayName)
      console.log('\nStep 2️: Completing login...');
      Alert.alert(
        'Login Berhasil',
        `Selamat datang, di CHITTA`
      );

      setIsLoggedIn(true);
      setUserRole('user');
      const userData = {
        id: userId,
        nama: displayName,
        role: 'user',
        hcGatewayToken: token,
        hcGatewayUserId: userId,
        hcGatewayRefreshToken: refreshToken,
        hcGatewayExpiry: expiry,
        loginMethod: 'hcgateway',
      };
      setUserData(userData);

      setHCGatewayToken(token);

      // Step 3: Start Hourly Predictions
      console.log('\nStep 3️: Starting hourly prediction service...');
      try {
        hourlyPredictionService.startHourlyPredictions(token, userId);
        console.log('Hourly predictions started (will run every 2 hours)');
      } catch (predictionError) {
        console.error('Failed to start predictions:', predictionError.message);
        Alert.alert('Warning', 'Login successful but predictions failed to start');
      }

      // NAVIGATE TO HOME with userData
      navigation.replace('Home', { userData });

      console.log('\n' + '='.repeat(50));
      console.log('LOGIN COMPLETE');
      console.log('='.repeat(50) + '\n');

      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('HCGateway login error:', error);
      console.log('='.repeat(50) + '\n');
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Single entry point for the button to preserve existing logic.
  const handleLoginPress = () => {
    if (loginMethod === 'dummy') {
      handleDummyLogin();
    } else {
      handleHCGatewayLogin();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.topSpacer} />

        <View style={styles.logoArea}>
          {/* Replace with your logo asset path */}
          <Image
            source={require('../../assets/chitta.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>LOG IN</Text>

          <Text style={styles.subtitle}>
            Masukkan NIM (Mahasiswa) atau NIP (Admin) dan Password untuk
            melanjutkan.
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan NIM / NIP"
              placeholderTextColor="#9b9b9b"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
              keyboardType="default"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Masukkan Password"
              placeholderTextColor="#9b9b9b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              autoCapitalize='none'
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={loading}
              style={styles.forgotRow}
            >
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLoginPress}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.noAccountText}>Belum memiliki akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Daftar di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8F8FB', // soft background like screenshot
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topSpacer: {
    height: 30,
  },
  logoArea: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 6,
  },
  card: {
    width: '90%',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginTop: 4,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
    marginBottom: 18,
    lineHeight: 18,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: '#6B46C1',
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotText: {
    color: '#5560d6',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    width: 160,
    height: 46,
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 12,
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  noAccountText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '600',
  },
  registerText: {
    color: '#5560d6',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    flex: 1,
  },
});