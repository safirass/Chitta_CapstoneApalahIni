import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Profile = () => {
return (
    <View style={styles.container}>
    <View style={styles.profileContainer}>
        <Image
        style={styles.profileImage}
        source={require('../assets/tidur.png')}  // Ganti dengan URL gambar dari backend?
        />
    </View>

    {/* pokoknya enih nanti sesuaiin ama backendnya */}
    <View style={styles.infoContainer}> 
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>Monkey D Luffy</Text>   
        <Text style={styles.label}>NIM</Text>
        <Text style={styles.value}>2112021240147</Text>
        <Text style={styles.label}>Jurusan</Text>
        <Text style={styles.value}>Teknik Komputer</Text>
        <Text style={styles.label}>Fakultas</Text>
        <Text style={styles.value}>Teknik</Text>
        <Text style={styles.label}>Semester</Text>
        <Text style={styles.value}>6</Text>
        <Text style={styles.label}>Jenis Kelamin</Text>
        <Text style={styles.value}>Laki-laki</Text>
    </View>
    
    <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>→ Logout</Text>
    </TouchableOpacity>
    </View>

);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
},
header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
},
backButton: {
    fontSize: 24,
},
title: {
    fontSize: 20,
    fontWeight: 'bold',
},
profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
},
profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
},
infoContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
},
label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
},
value: {
    fontSize: 16,
    marginBottom: 10,
},
logoutButton: {
    alignItems: 'flex-end',
},
logoutText: {
    fontSize: 16,
    color: '#007AFF',
},
});

export default Profile;