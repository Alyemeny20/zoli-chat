import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function OTPVerificationScreen({ route, navigation }) {
  const [code, setCode] = useState('');
  const { confirmResult } = route.params;

  const verifyCode = async () => {
    try {
      await confirmResult.confirm(code);
      navigation.replace('Home');
    } catch (error) {
      alert('Invalid code. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Verify" onPress={verifyCode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderBottomWidth: 1, width: '80%', marginBottom: 20, fontSize: 18 },
});
