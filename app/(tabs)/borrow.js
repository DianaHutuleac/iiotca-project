import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBookDescription } from '../utils/api.js';
import ModalComponent from '../components/ModalComponent';
import { requestPermissions } from '../utils/notifications';

export default function BorrowPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [availableBooksData, setAvailableBooksData] = useState([]);
  const [isWaitingForRFID, setIsWaitingForRFID] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    requestPermissions();
    fetchBooksData();
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
    const weightIsZero = true;
    if (weightIsZero) {
      navigation.navigate('BorrowConfirmScreen', { book: selectedBook });
    } else {
      Alert.alert('Error', `Please ensure you have taken the book: "${selectedBook.bookName}"`);
    }
  };

  const generateDescription = (book) => {
    fetchBookDescription(book.bookName)
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Books</Text>
      {availableBooksData.map((book) => (
        !book.borrowed ? 
        <View key={book.id} style={styles.bookContainer}>
          <Image source={{ uri: book.pic }} style={styles.coverImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.title}>{book.bookName}</Text>
            <Text style={styles.subtitle}>{book.author}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Borrow" onPress={() => borrowBook(book)} />
              <Button title="Generate Description" onPress={() => generateDescription(book)} />
            </View>
          </View>
        </View>
        : null
      ))}
      <ModalComponent
        isVisible={modalVisible}
        description={generatedDescription}
        onClose={closeModal}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={isWaitingForRFID}
        onRequestClose={() => {
          // Disable closing the modal
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Waiting for RFID scan...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>
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
    marginBottom: 30,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
  },
});
