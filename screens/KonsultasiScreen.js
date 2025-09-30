import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';

// Fungsi untuk membuat dummy response
const getDummyAIResponse = (userMessage) => {
const lowerMessage = userMessage.toLowerCase().trim();

// Logika sederhana berdasarkan kata kunci
if (lowerMessage.includes('halo') || lowerMessage.includes('hi')) {
    return 'Halo juga! Apa kabar?';
} else if (lowerMessage.includes('apa kabar') || lowerMessage.includes('how are you')) {
    return 'Saya baik, terima kasih! Kamu apa kabar?';
} else if (lowerMessage.includes('tidur') || lowerMessage.includes('sleep')) {
    return 'Wah, ngomongin tidur? Sudah cukup istirahat belum?';
} else if (lowerMessage.includes('makan') || lowerMessage.includes('food')) {
    return 'Mmm, makanan apa yang kamu suka hari ini?';
} else {
    // Default response jika tidak ada kata kunci yang cocok
    return 'Hmm, menarik! Ceritain lebih banyak dong!';
}
};

const KonsultasiScreen = () => {
const [messages, setMessages] = useState([]); // Array pesan: [{ id, text, isUser, timestamp }]
const [inputText, setInputText] = useState('');
const [isLoading, setIsLoading] = useState(false);
const flatListRef = useRef(null); // Untuk scroll ke bawah otomatis

// Fungsi kirim pesan user
const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
    id: Date.now().toString(),
    text: inputText,
    isUser: true,
    timestamp: new Date(),
    };

    // Tambah pesan user ke state
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulasi delay seperti API call
    setTimeout(() => {
    // Ambil dummy response
    const aiReply = getDummyAIResponse(userMessage.text);

    // Tambah response AI ke state
    const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        isUser: false,
        timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);

    // Scroll ke bawah setelah update state
    flatListRef.current?.scrollToEnd({ animated: true });
    }, 1000); // Delay 1 detik untuk simulasi
};

// Render item pesan (bubble chat)
const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
    <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
        {item.text}
    </Text>
    <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString()}
    </Text>
    </View>
);

return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        inverted // Balik urutan agar pesan terbaru di bawah
    />
    
    {/* Loading Indicator jika sedang nunggu AI */}
    {isLoading && (
        <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#534DD9" />
        <Text style={styles.loadingText}>AI sedang berpikir...</Text>
        </View>
    )}

    {/* Input Area */}
    <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Ketik pesan Anda..."
        multiline
        maxLength={500}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
},
list: {
    flex: 1,
    padding: 10,
},
listContent: {
    paddingBottom: 10,
},
messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
},
userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#534DD9',
},
aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
},
messageText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
},
userText: {
    color: '#fff',
},
aiText: {
    color: '#333',
},
timestamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
},
loadingContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
},
loadingText: {
    marginTop: 5,
    color: '#666',
},
inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
},
input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
},
sendButton: {
    backgroundColor: '#534DD9',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
},
sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
});

export default KonsultasiScreen;