import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { firebase } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  const sendOTP = async () => {
    const phoneNumber = '+966' + phone.replace(/^0+/, '');
    try {
      const result = await firebase.auth().signInWithPhoneNumber(phoneNumber);
      navigation.navigate('Verify', { confirmResult: result });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter your phone number</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="5xxxxxxxx"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Send OTP" onPress={sendOTP} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderBottomWidth: 1, width: '80%', marginBottom: 20, fontSize: 18 },
});
