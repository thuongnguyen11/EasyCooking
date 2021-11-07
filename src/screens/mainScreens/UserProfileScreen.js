import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import auth from '@react-native-firebase/auth';

export default function UserProfileScreen() {
    return (
        <View>
            <Text>day la user profile</Text>
            <Button onPress={() => auth().signOut()}>Logout</Button>
        </View>
    )
}