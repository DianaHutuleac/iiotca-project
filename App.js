import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './app/(tabs)/index';
import BorrowTab from './app/(tabs)/borrow';
import ReturnTab from './app/(tabs)/return';
import ProfileLayout from './app/(tabs)/profileTab/_layout';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeTab} />
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
