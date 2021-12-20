import React, { useState } from "react";
import { Animated, Dimensions, StyleSheet, ToastAndroid, View, TouchableOpacity, Image, Text } from 'react-native';
import { useRef } from 'react';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ToastProvider } from 'react-native-toast-notifications'
import { ModalPortal } from 'react-native-modals';

import SignInScreen from "./src/screens/authScreens/SignInScreen";
import SignUpScreen from "./src/screens/authScreens/SignUpScreen";
import SplashScreen from "./src/screens/authScreens/SplashScreen";
import { USER_TYPE } from "./src/global/constants";
import MainScreen from "./src/screens/mainScreens/MainScreen";
import UserProfileScreen from "./src/screens/mainScreens/UserProfileScreen";
import SearchScreen from "./src/screens/mainScreens/SearchScreen";
import CreateRecipeScreen from "./src/screens/mainScreens/CreateRecipeScreen";
import NotificationScreen from "./src/screens/mainScreens/NotificationScreen";
import DetailScreen from "./src/screens/mainScreens/DetailScreen";
import MostPopularScreen from "./src/screens/mainScreens/MostPopularScreen";
import MyRecipeScreen from "./src/screens/mainScreens/MyRecipeScreen";
import MyFavoriteScreen from "./src/screens/mainScreens/MyFavoriteScreen";
import PendingRecipesScreen from "./src/screens/mainScreens/PendingRecipesScreen";
import EditRecipeScreen from "./src/screens/mainScreens/EditRecipeScreen";
import RecipeReviewScreen from "./src/screens/mainScreens/RecipeReviewScreen";

import themes from "./src/config/themes";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

  let screens = <Stack.Screen name="SplashScreen" component={SplashScreen} />

  const onCreateUser = async (email, password) => {
    await auth().createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        firestore().collection('users').doc(authUser.user.uid)
          .set({ type: USER_TYPE.USER, createdAt: firestore.FieldValue.serverTimestamp(), favorites: [] })
          .then(() => setAuthState(USER_TYPE.USER));
      }).catch(error => {
        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show("Email/Mật khẩu is không hợp lệ!", ToastAndroid.SHORT);
        }
        console.log(error);
      })
  }

  const onSignIn = async (email, password) => {
    await auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log('OK'))
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          ToastAndroid.show("Email/password is không chính xác!", ToastAndroid.SHORT);
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
    screens = <Stack.Screen name="SplashScreen" component={SplashScreen} />

  } else if (authState === 'UNAUTHORIZED') {

    screens = <>
      <Stack.Screen name="SignIn">
        {props => <SignInScreen {...props} onSignIn={onSignIn} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {props => <SignUpScreen {...props} onCreateUser={onCreateUser} />}
      </Stack.Screen>
    </>
  } else {
    screens =
      <>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}>
          {props => <Home {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Detail">
          {props => <DetailScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="MostPopular">
          {props => <MostPopularScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="MyRecipe">
          {props => <MyRecipeScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="MyFavorite">
          {props => <MyFavoriteScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="PendingRecipes">
          {props => <PendingRecipesScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="EditRecipe">
          {props => <EditRecipeScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="RecipeReview">
          {props => <RecipeReviewScreen {...props} />}
        </Stack.Screen>
      </>
  }

  return (
    <ToastProvider
      offsetTop={310}
      placement="top"
      renderType={{
        custom_toast: (toast) => (
          <View
            style={{
              maxWidth: "85%",
              paddingHorizontal: 30,
              paddingVertical: 30,
              backgroundColor: "#abebb5",
              marginVertical: 4,
              borderRadius: 8,
              borderLeftColor: "#00C851",
              borderLeftWidth: 6,
              justifyContent: "center",
              paddingLeft: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#037041',
              }}
            >
              {toast.data.title}
            </Text>
            <Text style={{ color: themes.colors.main, marginTop: 2, fontSize: 16 }}>{toast.message}</Text>
          </View>
        ),
        with_close_button: (toast) => (
          <View
            style={{
              maxWidth: "85%",
              paddingVertical: 10,
              backgroundColor: "#fff",
              marginVertical: 4,
              borderRadius: 8,
              borderLeftColor: "#00C851",
              borderLeftWidth: 6,
              justifyContent: "center",
              paddingHorizontal: 16,
              flexDirection: "row",
            }}
          >
            <Text style={{ color: "#a3a3a3", marginRight: 16 }}>{toast.message}</Text>
            <TouchableOpacity
              onPress={() => toast.onHide()}
              style={{
                marginLeft: "auto",
                width: 25,
                height: 25,
                borderRadius: 5,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500", marginBottom: 2.5 }}>
                x
              </Text>
            </TouchableOpacity>
          </View>
        ),
      }}>
      <PaperProvider theme={theme}>
        <NavigationContainer style={styles.container}>
          <Stack.Navigator style={styles.container} screenOptions={{
            headerShown: false,
          }}>
            {screens}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
      <ModalPortal />
    </ToastProvider>
  );
}

function Home() {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      showLabel: false,
      tabBarShowLabel: false,
      // Floating Tab Bar...
      style: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 50,
        marginHorizontal: 20,
        // Max Height...
        height: 60,
        borderRadius: 10,
        // Shadow...
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: {
          width: 10,
          height: 10
        },
        paddingHorizontal: 20,
      }
    }}>
      <Tab.Screen name={"Main"} component={MainScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            // centring Tab Button...
            position: 'absolute',
            top: 12
          }}>
            <Icon
              name="home"
              size={24}
              color={focused ? '#029c59' : 'gray'}
            ></Icon>
          </View>
        )
      }} listeners={({ navigation, route }) => ({
        // Onpress Update....
        tabPress: e => {
          Animated.spring(tabOffsetValue, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      })}></Tab.Screen>

      <Tab.Screen name={"Search"} component={SearchScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            // centring Tab Button...
            position: 'absolute',
            top: 12
          }}>
            <Icon
              name="search"
              size={24}
              color={focused ? '#029c59' : 'gray'}
            ></Icon>
          </View>
        )
      }} listeners={({ navigation, route }) => ({
        // Onpress Update....
        tabPress: e => {
          Animated.spring(tabOffsetValue, {
            toValue: getWidth(),
            useNativeDriver: true
          }).start();
        }
      })}></Tab.Screen>


      <Tab.Screen name={"CreateRecipe"} component={CreateRecipeScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            width: 55,
            height: 55,
            backgroundColor: '#029c59',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: Platform.OS == "android" ? 50 : 30
          }}>
            <Icon
              name="plus"
              size={24}
              color='white'
            ></Icon>
          </View>
        )
      }}
        listeners={({ navigation, route }) => ({
          // Onpress Update....
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: getWidth() * 3,
              useNativeDriver: true
            }).start();
          }
        })}></Tab.Screen>

      <Tab.Screen name={"Notifications"} component={NotificationScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            // centring Tab Button...
            position: 'absolute',
            top: 12
          }}>
            <Icon
              name="bell"
              size={24}
              color={focused ? '#029c59' : 'gray'}
            ></Icon>
          </View>
        )
      }} listeners={({ navigation, route }) => ({
        // Onpress Update....
        tabPress: e => {
          Animated.spring(tabOffsetValue, {
            toValue: getWidth() * 3,
            useNativeDriver: true
          }).start();
        }
      })}></Tab.Screen>

      <Tab.Screen name={"UserProfile"} component={UserProfileScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            // centring Tab Button...
            position: 'absolute',
            top: 12
          }}>
            <Icon
              name="user-alt"
              size={24}
              color={focused ? '#029c59' : 'gray'}
            ></Icon>
          </View>
        )
      }} listeners={({ navigation, route }) => ({
        // Onpress Update....
        tabPress: e => {
          Animated.spring(tabOffsetValue, {
            toValue: getWidth() * 4,
            useNativeDriver: true
          }).start();
        }
      })}></Tab.Screen>

    </Tab.Navigator>
  );
}

function getWidth() {
  let width = Dimensions.get("window").width

  // Horizontal Padding = 20...
  width = width - 80

  // Total five Tabs...
  return width / 5
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});