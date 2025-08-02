import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../firebase';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('users').onSnapshot(snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    });
    return unsubscribe;
  }, []);

  const openChat = (user) => {
    navigation.navigate('Chat', { user });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChat(item)} style={styles.userItem}>
            <Text style={styles.username}>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  userItem: { padding: 16, borderBottomWidth: 1, borderColor: '#ccc' },
  username: { fontSize: 18 },
});
