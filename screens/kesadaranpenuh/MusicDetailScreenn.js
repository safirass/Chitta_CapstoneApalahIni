import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default function MusicDetailScreen({ route, navigation }) {
const { track } = route.params;
const [sound, setSound] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);

const playPause = async () => {
    if (sound) {
    if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
    } else {
        await sound.playAsync();
        setIsPlaying(true);
    }
    } else {
    const { sound: newSound } = await Audio.Sound.createAsync({
        uri: track.preview_url, // Spotify preview 30 detik
    });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
    }
};

return (
    <View style={styles.container}>
    <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
    >
        <Ionicons name="arrow-back" size={28} color="#333" />
    </TouchableOpacity>

    <Image
        source={{ uri: track.album.images[0].url }}
        style={styles.album}
    />
    <Text style={styles.name}>{track.name}</Text>
    <Text style={styles.artist}>{track.artists[0].name}</Text>

    <TouchableOpacity style={styles.playBtn} onPress={playPause}>
        <Ionicons
        name={isPlaying ? "pause" : "play"}
        size={34}
        color="#FFF"
        />
    </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EAE9FF",
    paddingTop: 40,
},
back: {
    position: "absolute",
    top: 50,
    left: 20,
},
album: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginTop: 80,
    marginBottom: 30,
},
name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
artist: { fontSize: 16, color: "gray", marginBottom: 40 },
playBtn: {
    backgroundColor: "#6C63FF",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
},
});
