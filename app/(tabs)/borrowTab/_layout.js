import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BorrowPage from '../borrow.js';
import BorrowConfirmScreen from './BorrowConfirmScreen.js';
import PasswordScreen from './PasswordScreen.js';
import React, { useState, useEffect, useRef } from 'react';
import {Platform} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

export default function BorrowLayout() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([],);
  const [notification, setNotification] = useState(undefined);
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
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name="BorrowPage" component={BorrowPage} />
      <Stack.Screen options={{headerShown:false}} name="BorrowConfirmScreen" component={BorrowConfirmScreen} />
      <Stack.Screen options={{headerShown:false}} name="PasswordScreen" component={PasswordScreen} />
    </Stack.Navigator>
  );
}