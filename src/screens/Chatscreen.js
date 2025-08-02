import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { firebase } from '../firebase';

export default function ChatScreen({ route }) {
  const { user } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const currentUser = firebase.auth().currentUser.phoneNumber;

  const chatId = [currentUser, user.phone].sort().join('_');

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => doc.data()));
      });
    return unsubscribe;
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    firebase.firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        sender: currentUser,
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>{item.sender}: {item.text}</Text>
        )}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});
