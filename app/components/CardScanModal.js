import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Button, TextInput } from 'react-native';

export default function CardScanModal({ isVisible, onSubmit, onCancel }) {
  const [cardId, setCardId] = useState('');

  const handleSubmit = () => {
    onSubmit(cardId);
    setCardId('');
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Please scan your card to continue</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter card ID"
            value={cardId}
            onChangeText={setCardId}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Cancel" onPress={onCancel} />
            </View>
            <View style={styles.button}>
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
