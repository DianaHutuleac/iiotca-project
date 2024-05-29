import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GluestackUIProvider, Heading, Box, FlatList, HStack, VStack } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import ModalComponent from '../components/ModalComponent';
import CardScanModal from '../components/CardScanModal';

const borrowedBooksData = [
  {
    id: '1',
    title: 'Pride and Prejudice',
    subtitle: 'Jane Austen',
    borrowDate: '2024-05-01',
    dueDate: '2024-05-15',
    position: 'A1',
    coverImage: require('../../assets/pride.jpg'),
  },
  {
    id: '2',
    title: 'Poems for Love',
    subtitle: 'Joanna Trollope',
    borrowDate: '2024-05-05',
    dueDate: '2024-05-19',
    position: 'B3',
    coverImage: require('../../assets/love.jpg'),
  },
  {
    id: '3',
    title: 'Agnes Grey',
    subtitle: 'Anne Bronte',
    borrowDate: '2024-05-10',
    dueDate: '2024-05-24',
    position: 'C2',
    coverImage: require('../../assets/agnes.jpg'),
  }
];

export default function Tab() {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState(borrowedBooksData);

  const navigation = useNavigation();

  const returnBook = (book) => {
    setSelectedBook(book);
    setScanModalVisible(true);
  };

  const handleScanCard = (cardId) => {
    // Mock card ID check for demonstration
    if (cardId === '123456') {
      setScanModalVisible(false);
      Alert.alert(
        'Door Unlocked',
        `Please put the book "${selectedBook.title}" in place at position ${selectedBook.position}.`,
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
    const weightIsCorrect = true; // Replace this with actual weight checking logic
    if (weightIsCorrect) {
      setBooks((prevBooks) => prevBooks.filter(book => book.id !== selectedBook.id));
      Alert.alert('Success', 'Book returned successfully');
    } else {
      Alert.alert('Error', `Please ensure you have placed the book: "${selectedBook.title}" correctly`);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeScanModal = () => {
    setScanModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Box
      borderBottomWidth="$1"
      borderColor="$trueGray800"
      $dark-borderColor="$trueGray100"
      $base-pl={0}
      $base-pr={0}
      $sm-pl="$4"
      $sm-pr="$5"
      py="$2"
    >
      <HStack space="md" justifyContent="space-between">
        <Image source={item.coverImage} style={styles.coverImage} />
        <VStack>
          <Text
            color="red"
            fontWeight="$bold"
            $dark-color="$warmGray100"
          >
            {item.title}
          </Text>
          <Text
            color="$coolGray600"
            $dark-color="$warmGray200"
          >
            {item.subtitle}
          </Text>
          <Text
            color="$coolGray600"
            $dark-color="$warmGray200"
          >
            Borrowed on: {item.borrowDate}
          </Text>
          <Text
            color="$coolGray600"
            $dark-color="$warmGray200"
          >
            Due Date: {item.dueDate}
          </Text>
        </VStack>
        <View style={styles.buttonContainer}>
          <Button title="Return" onPress={() => returnBook(item)} />
        </View>
      </HStack>
    </Box>
  );

  return (
    <GluestackUIProvider config={config}>
      <View>
        <Box py="$10">
          <Heading size="m" paddingLeft={20}>My Borrowed Books</Heading>
          {books.length > 0 ? (
            <FlatList
              data={books}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              paddingLeft={20}
              paddingRight={20}
            />
          ) : (
            <Text style={{ paddingLeft: 20, paddingRight: 20 }}>No borrowed books.</Text>
          )}
        </Box>
      </View>
      <ModalComponent
        isVisible={modalVisible}
        description=""
        onClose={closeModal}
      />
      <CardScanModal
        isVisible={scanModalVisible}
        onSubmit={handleScanCard}
        onCancel={closeScanModal}
      />
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  coverImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
