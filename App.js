import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import React, { useEffect } from 'react';
import { requestPermissions } from '../utils/notifications.js';

export default function App() {

  useEffect(() => {
    requestPermissions();
  }, []);
  
  return (
    <GluestackUIProvider config={config}>
      <Box width="100%" justifyContent="center" alignItems="center">
        <Text>Open up App.js to start working on your app!</Text>
      </Box>
    </GluestackUIProvider>
  );
}

