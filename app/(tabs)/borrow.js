import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBookDescription } from '../utils/api.js';
import ModalComponent from '../components/ModalComponent';
import CardScanModal from '../components/CardScanModal';
import { requestPermissions } from '../utils/notifications';

const availableBooksData = [
  {
    id: '1',
    title: 'Pride and Prejudice',
    subtitle: 'Jane Austen',
    coverImage: require('../../assets/pride.jpg'),
  },
  {
    id: '2',
    title: 'Poems for Love',
    subtitle: 'Joanna Trollope',
    coverImage: require('../../assets/love.jpg'),
  },
  {
    id: '3',
    title: 'Agnes Grey',
    subtitle: 'Anne Bronte',
    coverImage: require('../../assets/agnes.jpg'),
  }
];

export default function BorrowPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [doorUnlocked, setDoorUnlocked] = useState(false);

  const navigation = useNavigation();

  // Request permissions for notifications
  useEffect(() => {
    requestPermissions();
  }, []);

  const fetchBooksData = async () => {
    try {
      const response = await fetch('http://13.48.78.193:3000/books');
      const data = await response.json();
      setAvailableBooksData(data);
    } catch (error) {
      console.error('Error fetching books data:', error);
    }
  };

  const borrowBook = async (book) => {
    setSelectedBook(book);
    Alert.alert('Please scan your RFID card.');

    try {
      const response = await fetch('http://13.48.78.193:3000/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.BookID,
          desiredPin: book.pin, // assuming book object has a pin attribute
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to borrow book');
      }

      setIsWaitingForRFID(true);

      const result = await response.json();
      setIsWaitingForRFID(false);

      if (result.message === 'Borrowing process completed') {
        let position;
        const pin = parseInt(book.pin, 10); // Ensure the pin is treated as a number
        console.log('Pin:', pin); // Log the pin number
        switch (pin) {
          case 31:
            position = 'left';
            break;
          case 16:
            position = 'center';
            break;
          case 13:
            position = 'right';
            break;
          default:
            position = 'unknown';
        }
        console.log('Position:', position); // Log the position
        Alert.alert(
          'Door Unlocked',
          `Please take the book "${selectedBook.bookName}" from the ${position} position.`,
          [
            {
              text: 'OK',
              onPress: () => handleWeightCheck(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to complete the borrowing process.');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      setIsWaitingForRFID(false);
      Alert.alert('Error', 'Failed to borrow book. Please try again.');
    }
  };

  const handleWeightCheck = () => {
    const weightIsZero = true; // Replace this with actual weight checking logic
    if (weightIsZero) {
      navigation.navigate('BorrowConfirmScreen', { book: selectedBook });
    } else {
      Alert.alert('Error', `Please ensure you have taken the book: "${selectedBook.title}"`);
    }
  };

  const generateDescription = (book) => {
    fetchBookDescription(book.title)
      .then((description) => {
        setGeneratedDescription(description);
        setError('');
        setModalVisible(true);
      })
      .catch((error) => {
        setGeneratedDescription('');
        setError('Error fetching book description');
        setModalVisible(true);
      });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeScanModal = () => {
    setScanModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Books</Text>
      {availableBooksData.map((book) => (
        <View key={book.id} style={styles.bookContainer}>
          <Image source={book.coverImage} style={styles.coverImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.subtitle}>{book.subtitle}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Borrow" onPress={() => borrowBook(book)} />
              <Button title="Description" onPress={() => generateDescription(book)} />
            </View>
          </View>
        </View>
      ))}
      <ModalComponent
        isVisible={modalVisible}
        description={generatedDescription}
        onClose={closeModal}
      />
      <CardScanModal
        isVisible={scanModalVisible}
        onSubmit={handleScanCard}
        onCancel={closeScanModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,  // Add marginBottom for spacing
  },
  bookContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

