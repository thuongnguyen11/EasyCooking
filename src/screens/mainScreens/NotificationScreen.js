import React, { useEffect, useState } from "react";

import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, Image, ActivityIndicator, Dimensions } from "react-native";
import { Rating } from "react-native-elements";
import { getNotifications, getReviewsOfRecipe } from "../../apis/FoodRecipeApi";

const NotificationItem = ({ notification }) => {
    return (
        <View key={notification.item.id} style={styles.item}>
            <View style={styles.poster}>
                <View >
                    {notification.item.avatar
                        ? <Image style={styles.image} source={{ uri: notification.item.avatar }} />
                        : <Image style={styles.avatarDefault}
                            source={require('../../assets/image/avatar_default5.png')} />}
                </View>
                <Text style={styles.notification}>{notification.item.content}</Text>
            </View>
            <View style={styles.commentItem}>
                <Text>{new Date(notification.item.createdAt.toDate()).toDateString()}</Text>
            </View>
        </View>
    )
}

const NotificationList = ({ notifications, loading }) => {
    const renderItem = (notification) => {
        return <NotificationItem notification={notification}></NotificationItem>
    }

    return (
        <View style={styles.container}>
            {loading ?
                <View style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 9, top: 350 }}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }
            {
                !loading && notifications && notifications.length === 0
                    ? <Text style={{ width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center' }}>Chưa có thông báo</Text>
                    : <FlatList
                        listKey={(item) => item.tracking_code.toString()}
                        scrollEnabled={false}
                        data={notifications}
                        renderItem={renderItem}>
                    </FlatList>
            }

        </View>


    )
}

export default NotificationScreen = ({ route, navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, [])

    const fetchNotifications = () => {
        setLoading(true);
        getNotifications((notifications => {
            setLoading(false);
            setNotifications(notifications);
        }))
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <Text style={styles.title}>Thông báo</Text>
            <NotificationList notifications={notifications} loading={loading}></NotificationList>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: '500',
        color: '#029c59',
        textShadowColor: 'rgba(130, 237, 191, 0.9)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 7,
        textAlign: 'center',
    },
    container: {
        paddingHorizontal: 10,
    },
    poster: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    notification: {
        width: 300,
        color: '#393b3a'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
        marginRight: 15,
    },
    avatarDefault: {
        width: 50,
        height: 50,
        borderRadius: 100,
        marginRight: 15,
    },
    item: {

        borderBottomWidth: 0.5,
        borderColor: '#9ea3a1',
        paddingBottom: 10,
        marginTop: -10
    },
    commentItem: {
        paddingLeft: 65,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
})