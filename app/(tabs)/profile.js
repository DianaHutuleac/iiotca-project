import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Profile({ user, setIsLoggedIn }) {
  const navigation = useNavigation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigation.navigate('ProfileTab');
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome, {user.name}!</Text>
        <Text style={styles.subheading}>Email: {user.email}</Text>
        <Text style={styles.subheading}>Username: {user.username}</Text>
        <Text style={styles.activityHeading}>Recent Activity:</Text>
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
  activityHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  activity: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});
