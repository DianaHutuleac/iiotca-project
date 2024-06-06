import React, { useState, useEffect } from 'react';
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
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([],);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    console.log("Tewst")
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? []),
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    console.log("TEST")
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

    if (Constants.easConfig?.projectId) {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.easConfig.projectId, // you can hard code project id if you dont want to use expo Constants
        })
      ).data;
      console.log(token);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}


