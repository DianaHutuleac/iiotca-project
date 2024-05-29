import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { scheduleNotification } from '../../utils/notifications';
import * as Notifications from 'expo-notifications';

async function schedulePushNotification(notifTitle, message) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notifTitle,
      body: message,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

export default function BorrowConfirmScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

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
      handleBorrowSuccess();
    } else {
      Alert.alert('Authentication Failed', 'Please try again or enter your password.');
    }
  };

  const handleBorrowSuccess = async () => {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14); // Set return date to two weeks from today

    await schedulePushNotification('Return Book Reminder',`Please return the book "${book.title}" before ${returnDate.toDateString()}.`  );
    await scheduleNotification(
      'Return Book Reminder',
      `Please return the book "${book.title}" before ${returnDate.toDateString()}.`,
      returnDate
    );

    Alert.alert(
      'Success',
      `Book "${book.title}" borrowed successfully! Please don't forget to return it before ${returnDate.toDateString()}`
    );

    navigation.navigate('BorrowPage');
  };

  const handlePasswordSubmit = () => {
    if (password === 'yourPassword') { // Replace 'yourPassword' with actual password logic
      setIsAuthenticated(true);
      handleBorrowSuccess();
    } else {
      Alert.alert('Error', 'Incorrect password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={book.coverImage} style={styles.coverImage} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.subtitle}>{book.subtitle}</Text>
      {!isAuthenticated ? (
        <View>
          <Button title="Confirm Borrow" onPress={handleFaceID} />
          <Text style={styles.prompt}>Enter your password to borrow this book:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Submit" onPress={handlePasswordSubmit} />
          <Button title="Cancel" onPress={() => navigation.navigate('BorrowPage')} />
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