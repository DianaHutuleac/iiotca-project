import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './app/(tabs)/index';
import BorrowTab from './app/(tabs)/borrow';
import ReturnTab from './app/(tabs)/return';
import ProfileLayout from './app/(tabs)/profileTab/_layout';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import Login from './app/screens/Login';
import { Button } from '@gluestack-ui/themed';
import { Stack } from 'expo-router/stack';
import { AuthProvider, useAuth } from './app/context/AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {authState, onLogout} = useAuth();


  return (

    <AuthProvider>
    <NavigationContainer>
      <StackNavigator>
        {authState?.authenticated ? (
            <Stack.Screen name="Home" component={HomeTab} 
            options = {{
              headerRight: () => <Button onPress={onLogout} title="Sign Out" />,
            }}/>
          ) : (
            <Stack.Screen name='Login' component={Login} />
          )
          } 
      </StackNavigator>
      { /* <Tab.Navigator>
          
          
          <Tab.Screen name="Borrow" component={BorrowTab} />
          <Tab.Screen name="Return" component={ReturnTab} />
          <Tab.Screen name="Profile">
            {(props) => (
              <ProfileLayout
                {...props}
                user={user}
                setUser={setUser}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>*/}
    </NavigationContainer>
    </AuthProvider>

    
  );
}
