// app/(tabs)/borrowTab/PasswordScrren.js


import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PasswordScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params;
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = () => {
    // Perform password validation here
    if (password === 'yourPassword') { // Replace with actual password validation logic
      Alert.alert('Success', 'Book borrowed successfully!');
      navigation.navigate('BorrowPage');
    } else {
      Alert.alert('Error', 'Incorrect password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>Enter your password to borrow this book:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Submit" onPress={handlePasswordSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  prompt: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
