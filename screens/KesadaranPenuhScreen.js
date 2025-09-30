import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function KesadaranPenuhScreen({ navigation }) {
return (
    <ScrollView style={styles.container}>
    <Text style={styles.header}>Kesadaran Penuh</Text>

    {/* Card 1 */}
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Music')}>
        <View style={styles.textContainer}>
        <Text style={styles.title}>Dengarkan Musik Relaksasi</Text>
        <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            elementum aliquam facilisis.
        </Text>
        </View>
        <Image
        source={{recuire: '../assets/musik.png' }}
        style={styles.image}
        />
    </TouchableOpacity>

    {/* Card 2 */}
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Breathing')}>
        <View style={styles.textContainer}>
        <Text style={styles.title}>Atur Pernapasan</Text>
        <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            elementum aliquam facilisis.
        </Text>
        </View>
        <Image
        source={{recuire: '../assets/nafas.png'}}
        style={styles.image}
        />
    </TouchableOpacity>

    {/* Card 3 */}
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Journal')}>
        <View style={styles.textContainer}>
        <Text style={styles.title}>Jurnal</Text>
        <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            elementum aliquam facilisis.
        </Text>
        </View>
        <Image
        source={{ recuire: '../assets/jurnal.png' }}
        style={styles.image}
        />
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#EFECFE',
    padding: 16,
},
header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
},
card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
},
textContainer: {
    flex: 1,
    paddingRight: 10,
},
title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
},
desc: {
    fontSize: 13,
    color: '#666',
},
image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
},
});
