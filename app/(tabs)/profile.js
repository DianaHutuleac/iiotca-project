import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock user data for demonstration
const mockUserData = {
  username: 'johndoe',
  password: 'password123',
  name: 'John Doe',
  activity: [
    { id: '1', description: 'Borrowed "Pride and Prejudice" on 2024-05-01' },
    { id: '2', description: 'Returned "Pride and Prejudice" on 2024-05-15' },
  ],
};

// Create a context for user state
const UserContext = React.createContext();

export default function Tab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome, {user.name}!</Text>
        <Text style={styles.subheading}>Recent Activity:</Text>
        {user.activity.map((item) => (
          <Text key={item.id} style={styles.activity}>{item.description}</Text>
        ))}
        <Button title="Log Out" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to your Library profile</Text>
      <Button title="Log In" onPress={() => navigation.navigate('Login')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  activity: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});
