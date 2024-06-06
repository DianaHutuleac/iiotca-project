

import { GluestackUIProvider, Text, Box, Button, ButtonText, ButtonIcon, AddIcon, Textarea, TextareaInput} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import { Link } from 'expo-router';
import { View } from 'react-native'


export default function Page() {
  return (
    <GluestackUIProvider config={config}>
      <Box width="100%" justifyContent="center" alignItems="center">
       
  
    <Link push href="/" asChild>
        <Button size="md" variant="outline" action="primary" isDisabled={false} isFocusVisible={true} >
          <ButtonText>Borrow</ButtonText>
          <ButtonIcon as={AddIcon} />
        </Button>
      
    </Link>
      

      </Box>
    </GluestackUIProvider>
  );
}

