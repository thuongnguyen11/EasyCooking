import React, { useState } from "react";
import { StyleSheet, ToastAndroid } from 'react-native'
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';

import SignInScreen from "./src/screens/authScreens/SignInScreen";
import SignUpScreen from "./src/screens/authScreens/SignUpScreen";
import SplashScreen from "./src/screens/authScreens/SplashScreen";
import { USER_TYPE } from "./src/global/constants";
import MainScreen from "./src/screens/mainScreens/MainScreen";

const Stack = createNativeStackNavigator();

function AppStack(props) {
  return (
    <Stack.Navigator style={styles.container} screenOptions={{
      headerShown: false,
    }}>
      {props.screens}
    </Stack.Navigator>
  )
}

export default function App() {

  const [authState, setAuthState] = useState('INITIAL');
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  let screens = <>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
  </>;

  const onCreateUser = async (email, password) => {
    await auth().createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        firestore().collection('users').doc(authUser.user.uid).set({ type: USER_TYPE.USER })
          .then(() => setAuthState(USER_TYPE.USER));
      }).catch(error => {
        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show("Email/password is not correct!", ToastAndroid.SHORT);
        }
        console.log(error);
      })
  }

  const onSignIn = async (email, password) => {
    await auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log('OK'))
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          ToastAndroid.show("Email/password is not correct!", ToastAndroid.SHORT);
        }
        console.log(error);
      })
  };


  auth().onAuthStateChanged(async user => {
    if (!user) {
      setAuthState('UNAUTHORIZED');
    } else {
      const userDb = await firestore().collection('users').doc(user.uid).get();
      if (userDb.get('type') === USER_TYPE.USER) {
        setAuthState(USER_TYPE.USER);
      } else {
        setAuthState(USER_TYPE.ADMIN);
      }
    }
  });

  if (authState === 'INITIAL') {
    screens = <>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
    </>;
  } else if (authState === 'UNAUTHORIZED') {
    screens = <>
      <Stack.Screen name="SignIn">
        {props => <SignInScreen {...props} onSignIn={onSignIn} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {props => <SignUpScreen {...props} onCreateUser={onCreateUser} />}
      </Stack.Screen>
    </>;
  } else {
    screens = <>
      <Stack.Screen name="MainScreen" component={MainScreen} />
    </>;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppStack screens={screens} />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})

