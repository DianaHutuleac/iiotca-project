/*import { Stack } from 'expo-router/stack';
import { AuthProvider, useAuth } from './app/context/AuthContext';


export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>

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
    </NavigationContainer>
    </AuthProvider>

  );
}*/
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './screens/Home';
import Login from './screens/Login';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import FontAwesome from '@expo/vector-icons/FontAwesome5';


import TabLayout from './(tabs)/_layout';
import ProfileLayout from './(tabs)/profileTab/_layout';
import BorrowLayout from './(tabs)/borrowTab/_layout';
import Return from './(tabs)/return';
import FirstHome from './(tabs)';
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="index"
        component={FirstHome}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tab.Screen
        name="borrowTab"
        component={BorrowLayout}
        options={{
          title: 'Borrow',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-open" color={color} />,
          headerShown: false, // Hide the header for this screen
        }}
      />

      <Tab.Screen
        name="return"
        component={Return}
        options={{
          title: 'Return',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tab.Screen
        name="profileTab"
        component={ProfileLayout}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-reader" color={color} />,
          headerShown: false, // Hide the header for this screen
        }}
      />

    </Tab.Navigator>
  );
}

function AppLayout() {
  const { authState, onLogout } = useAuth();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {authState?.authenticated ? (
          //<Stack.Screen name="(tabs)" component={ProfileLayout} />
          <Stack.Screen  
            name=" " 
            component={MainTabs}
            options={{
              tabBarStyle: { display: 'none' },
              
              
              
            }}
          />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;


