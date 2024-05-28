// ModalComponent.js
import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';

export default function ModalComponent({ isVisible, description, onClose }) {
  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Book Description</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : (
          <Text style={styles.error}>Error fetching book description</Text>
        )}
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
});
