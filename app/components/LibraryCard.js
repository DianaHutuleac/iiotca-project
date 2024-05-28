import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
const LibraryCard = ({ name, id, expirationDate }) => {
  return (

    

    <View style={styles.cardContainer}>

      <View style={styles.card}>
      <Ionicons name="library" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.title}>Library Card</Text>
        <Text>Name: {name}</Text>
        <Text>Card ID: {id}</Text>
        <Text>Expires: {expirationDate}</Text>
      </View>
    
    </View>
    
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 300, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#ccc',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop: -100,
    
  },
  card: {
    flex: 1, // Ensure the card fills the container
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgba(154, 130, 238, 0.8)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  icon: {
    marginBottom: 10,
  },
});

export default LibraryCard;
