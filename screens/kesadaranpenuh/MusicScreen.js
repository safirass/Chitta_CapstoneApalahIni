import React, { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
TouchableOpacity,
Image,
StyleSheet,
ActivityIndicator,
} from "react-native";

import { getSpotifyToken, getRelaxationMusic } from "../../services/spotifyApi";

export default function MusicScreen({ navigation }) {
const [tracks, setTracks] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchMusic = async () => {
    const token = await getSpotifyToken();
    const data = await getRelaxationMusic(token);
    setTracks(data);
    setLoading(false);
    };
    fetchMusic();
}, []);

if (loading) {
    return (
    <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
    </View>
    );
}

return (
    <View style={styles.container}>
    <Text style={styles.title}>Musik Relaksasi</Text>

    <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("MusicDetail", { track: item })}
        >
            <Image
            source={{ uri: item.album.images[0]?.url }}
            style={styles.image}
            />
            <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.artist}>{item.artists[0].name}</Text>
            </View>
        </TouchableOpacity>
        )}
    />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#EEF0FF", padding: 16 },
center: { flex: 1, alignItems: "center", justifyContent: "center" },
title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
},
image: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
name: { fontSize: 16, fontWeight: "500" },
artist: { fontSize: 14, color: "gray" },
});
