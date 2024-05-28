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

  const borrowBook = (book) => {
    setSelectedBook(book);
    setScanModalVisible(true);
  };

  const handleScanCard = (cardId) => {
    // Mock card ID check for demonstration
    if (cardId === '123456') {
      setScanModalVisible(false);
      setDoorUnlocked(true);
      Alert.alert(
        'Door Unlocked',
        `Please take the book "${selectedBook.title}" from the box.`,
        [
          {
            text: 'OK',
            onPress: () => handleWeightCheck(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Invalid card. Please try again.');
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
              <Button title="Generate Description" onPress={() => generateDescription(book)} />
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
