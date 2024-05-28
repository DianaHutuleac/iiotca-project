// app/screens/BorrowConfirmScreen.js
/*import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function BorrowConfirmScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleFaceID = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Error', 'Your device does not support Face ID');
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Error', 'No Face ID enrolled on this device');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to borrow book',
      fallbackLabel: 'Enter Password',
    });

    if (result.success) {
      setIsAuthenticated(true);
      Alert.alert('Success', 'Book borrowed successfully!');
      // Navigate to the success or main screen
      navigation.navigate('MainScreen');
    } else {
      Alert.alert('Authentication Failed', 'Please try again or enter your password.');
    }
  };

  const handlePassword = () => {
    // Navigate to password entry screen
    navigation.navigate('PasswordScreen', { book });
  };

  return (
    <View style={styles.container}>
      <Image source={book.coverImage} style={styles.coverImage} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.subtitle}>{book.subtitle}</Text>
      {!isAuthenticated ? (
        <View>
          <Button title="Confirm Borrow" onPress={handleFaceID} />
          <Button title="Enter Password" onPress={handlePassword} />
        </View>
      ) : (
        <Text style={styles.successMessage}>You have borrowed this book.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: 100,
    height: 150,
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
  successMessage: {
    fontSize: 18,
    color: 'green',
    marginTop: 20,
  },
});
*/