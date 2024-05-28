// app/tabs/BorrowStack.js
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tab from '../(tabs)/borrow'; // Ensure the path is correct
import BorrowScreen from './BorrowScreen'; // Ensure the path is correct

const Stack = createStackNavigator();

function BorrowStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BorrowPage" component={Tab} options={{ title: 'Borrow Books' }} />
      <Stack.Screen name="BorrowScreen" component={BorrowScreen} options={{ title: 'Confirm Borrow' }} />
    </Stack.Navigator>
  );
}

export default BorrowStack;
