import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function ProfileLayout() {
  const { authState, onLogout } = useAuth();
  const [activity, setActivity] = useState([]);
  const [userInfo, setUserInfo] = useState({ email: '' });

  useEffect(() => {
    if (authState?.authenticated) {
      setActivity(['Created account']);
    }
  }, [authState?.authenticated]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user-info', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (authState.token) {
      fetchUserInfo();
    }
  }, [authState.token]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Hello, {userInfo.email || 'User'}!</Text>
      <Button onPress={onLogout} title="Sign Out" />

      <Text style={{ marginTop: 20, fontSize: 18 }}>Your Recent Activity:</Text>
      {activity.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
};


//export default Profile;
