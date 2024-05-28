// BorrowScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function BorrowScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;

  const confirmBorrow = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    if (hasHardware && supported.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        // Handle successful authentication
        alert('Book borrowed successfully!');
        navigation.goBack();
      } else {
        alert('Authentication failed!');
      }
    } else {
      // Fallback to password
      // Here you would implement a password input or other form of authentication
      alert('Face ID not available. Please use your password to confirm.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={book.coverImage} style={styles.coverImage} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.subtitle}>{book.subtitle}</Text>
      <Button title="Confirm Borrow" onPress={confirmBorrow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coverImage: {
    width: 150,
    height: 220,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});
