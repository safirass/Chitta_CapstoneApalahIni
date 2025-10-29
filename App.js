import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import KesadaranPenuhScreen from "./screens/KesadaranPenuhScreen";
import PemantauanStresScreen from "./screens/PemantauanStresScreen";
import PelacakanTidurScreen from "./screens/PelacakanTidurScreen";
import PemantauanMahasiswaScreen from "./screens/PemantauanMahasiswaScreen";
import KonsultasiScreen from "./screens/KonsultasiScreen";
import MusicScreen from "./screens/kesadaranpenuh/MusicScreen";
import BreathingScreen from "./screens/kesadaranpenuh/BreathingScreen";
import JournalScreen from "./screens/kesadaranpenuh/JournalScreen";
import TipsTidurScreen from "./screens/tips/TipsTidurScreen";
import TipsStresScreen from "./screens/tips/TipsStresScreen";
import IsiPemantauanScreen from "./screens/screening/IsiPemantauanScreen";
import SplashScreen from "./screens/auth/SplashScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import RegisterDetailScreen from "./screens/auth/RegisterDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // dummy login state

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Kalau belum login, tampilkan auth flow
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>

                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="RegisterDetail" component={RegisterDetailScreen} />
          </>
        ) : (
          // Kalau sudah login, tampilkan main app
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Kesadaran Penuh" component={KesadaranPenuhScreen} />
            <Stack.Screen name="Pemantauan Mahasiswa" component={PemantauanMahasiswaScreen} />
            <Stack.Screen name="Isi Pemantauan" component={IsiPemantauanScreen} />
            <Stack.Screen name="Konsultasi" component={KonsultasiScreen} />
            <Stack.Screen name="Pelacakan Tidur" component={PelacakanTidurScreen} />
            <Stack.Screen name="Tips Tidur" component={TipsTidurScreen} />
            <Stack.Screen name="Pemantauan Stres" component={PemantauanStresScreen} />
            <Stack.Screen name="Tips Stres" component={TipsStresScreen} />
            <Stack.Screen name="Music" component={MusicScreen} />
            <Stack.Screen name="Breathing" component={BreathingScreen} />
            <Stack.Screen name="Journal" component={JournalScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import HomeScreen from './screens/HomeScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import KesadaranPenuhScreen from './screens/KesadaranPenuhScreen';
// import PemantauanStresScreen from './screens/PemantauanStresScreen';
// import PelacakanTidurScreen from './screens/PelacakanTidurScreen';
// import PemantauanMahasiswaScreen from './screens/PemantauanMahasiswaScreen';
// import KonsultasiScreen from './screens/KonsultasiScreen';
// import MusicScreen from './screens/kesadaranpenuh/MusicScreen';
// import BreathingScreen from './screens/kesadaranpenuh/BreathingScreen';
// import JournalScreen from './screens/kesadaranpenuh/JournalScreen';
// import TipsTidurScreen from './screens/tips/TipsTidurScreen';
// import TipsStresScreen from './screens/tips/TipsStresScreen';
// import IsiPemantauanScreen from './screens/screening/IsiPemantauanScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="Kesadaran Penuh" component={KesadaranPenuhScreen} />
//         <Stack.Screen name="Pemantauan Mahasiswa" component={PemantauanMahasiswaScreen} />
//         <Stack.Screen name="Isi Pemantauan" component={IsiPemantauanScreen} />
//         <Stack.Screen name="Konsultasi" component={KonsultasiScreen} />
//         <Stack.Screen name="Pelacakan Tidur" component={PelacakanTidurScreen} />
//         <Stack.Screen name="Tips Tidur" component={TipsTidurScreen} />
//         <Stack.Screen name="Pemantauan Stres" component={PemantauanStresScreen} />
//         <Stack.Screen name="Tips Stres" component={TipsStresScreen} />
//         {/* <Stack.Screen name="Music" component={MusicScreen} /> */}
//         {/* <Stack.Screen name="MusicDetail" component={MusicDetailScreen} options={{ headerShown: false }}/> */}
//         <Stack.Screen name="Breathing" component={BreathingScreen} />
//         <Stack.Screen name="Journal" component={JournalScreen} options={{headerShown: false}} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// export default function App() {
//   return <KonsultasiScreen />
// }

//     // <NavigationContainer>
//     //   <Stack.Navigator initialRouteName="Home">
//     //     <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//     //     <Stack.Screen name="Profile" component={ProfileScreen} />
//     //     <Stack.Screen name="Kesadaran Penuh" component={KesadaranPenuhScreen} options={{ headerShown: false }} />
//     //     <Stack.Screen name="Pemantauan Mahasiswa" component={PemantauanMahasiswaScreen} />
//     //     <Stack.Screen name="Konsultasi" component={KonsultasiScreen} />
//     //     <Stack.Screen name="Pelacakan Tidur" component={PelacakanTidurScreen} />
//     //     <Stack.Screen name="Pemantauan Stres" component={PemantauanStresScreen} />
//     //   </Stack.Navigator>
//     // </NavigationContainer>
