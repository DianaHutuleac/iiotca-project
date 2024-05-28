// app/(tabs)/borrowTab/_layout.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BorrowPage from '../borrow.js';
import BorrowConfirmScreen from './BorrowConfirmScreen.js';
import PasswordScreen from './PasswordScreen.js';

const Stack = createNativeStackNavigator();

export default function BorrowLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name="BorrowPage" component={BorrowPage} />
      <Stack.Screen options={{headerShown:false}} name="BorrowConfirmScreen" component={BorrowConfirmScreen} />
      <Stack.Screen options={{headerShown:false}} name="PasswordScreen" component={PasswordScreen} />
    </Stack.Navigator>
  );
}
