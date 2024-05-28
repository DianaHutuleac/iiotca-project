import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GluestackUIProvider, Heading, Box, FlatList, HStack, VStack} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import LibraryCard from '../components/LibraryCard.js';

export default function Tab() {
  const data = [
    { id: '1', title: 'Item 1', subtitle: 'Description for Item 1', timestamp: '10:00 AM' },
    { id: '2', title: 'Item 2', subtitle: 'Description for Item 2', timestamp: '11:00 AM' },
    { id: '3', title: 'Item 3', subtitle: 'Description for Item 3', timestamp: '12:00 PM' },
    // Add more items as needed
  ];

  const renderItem = ({ item }) => (
    <Box
      borderBottomWidth="$1"
      borderColor="$trueGray800"
      $dark-borderColor="$trueGray100"
      $base-pl={0}
      $base-pr={0}
      $sm-pl="$4"
      $sm-pr="$5"
      py="$2"
    >
      <HStack space="md" justifyContent="space-between">
        <VStack>
          <Text
            color="red"
            fontWeight="$bold"
            $dark-color="$warmGray100"
          >
            {item.title}
          </Text>
          <Text
            color="$coolGray600"
            $dark-color="$warmGray200"
          >
            {item.subtitle}
          </Text>
        </VStack>
        <Text
          fontSize="$xs"
          color="$coolGray800"
          alignSelf="flex-start"
          $dark-color="$warmGray100"
        >
          {item.timestamp}
        </Text>
      </HStack>
    </Box>
  );

  return (
    <GluestackUIProvider config={config}>
      <View style={{ flex: 0 }}>
        <Text style={{ fontSize: 20, padding: 20, fontWeight: 'bold' }}>Hello [User]!</Text></View>
        <View style={styles.container}>
          <LibraryCard
            name="John Doe"
            id="123456789"
            expirationDate="2024-12-31"
          />
        </View>
        <View>
        <Box py="$10">
          <Heading size="m" paddingLeft={20}>My Books</Heading>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            paddingLeft={20}
            paddingRight={20}
          />
        </Box>
        </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

