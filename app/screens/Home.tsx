import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';
//layout
export default function Home() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#A295E1', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tabs.Screen
        name="borrowTab"
        options={{
          title: 'Borrow',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-open" color={color} />,
        }}
      />
      <Tabs.Screen
        name="borrow" // Hide this tab
        options={{
          href: null,
          title: 'Borrow',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-open" color={color} />,
          tabBarStyle: { display: 'none' }, // Hide the tab
        }}
      />
      <Tabs.Screen
        name="return"
        options={{
          title: 'Return',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profileTab"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-reader" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-reader" color={color} />,
        }}
      />
      
    </Tabs>
  );
}

//export default TabLayout;