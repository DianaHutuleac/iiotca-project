import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../profile';
import Login from './Login';
import Register from './Register';
//profile
const Stack = createNativeStackNavigator();

export default function ProfileLayout({ user, setUser, isLoggedIn, setIsLoggedIn }) {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name="Profile">
        {(props) => (
          <Profile
            {...props}
            user={user}
            setUser={setUser}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Stack.Screen>
      <Stack.Screen options={{headerShown:false}} name="Login">
        {(props) => (
          <Login
            {...props}
            setUser={setUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Stack.Screen>
      <Stack.Screen options={{headerShown:false}} name="Register">
        {(props) => (
          <Register
            {...props}
            setUser={setUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
