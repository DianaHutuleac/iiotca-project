

import { GluestackUIProvider, Text, Box, Button, ButtonText, ButtonIcon, AddIcon, Textarea, TextareaInput} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import { Link } from 'expo-router';
import { View } from 'react-native'
export default function Page() {
  return (
    <GluestackUIProvider config={config}>
      <Box width="100%" justifyContent="center" alignItems="center">
        <Text>Open up App.js to start working on your app!</Text>

        <Link push href="/borrow" asChild>

        <Button size="md" variant="outline" action="primary" isDisabled={false} isFocusVisible={true} >
          <ButtonText>Borrow</ButtonText>
          <ButtonIcon as={AddIcon} />
        </Button>
        </Link>
      
        <Textarea size="md" isReadOnly={false} isInvalid={false} isDisabled={false}  w='$64'>
          <TextareaInput
            placeholder="Your text goes here..."
          />
        </Textarea>
      

      </Box>
    </GluestackUIProvider>
  );
}

