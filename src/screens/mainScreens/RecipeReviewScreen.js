import React, { useEffect, useState } from "react";

import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Rating } from "react-native-elements";
import { getReviewsOfRecipe } from "../../apis/FoodRecipeApi";

const ReviewItem = ({ review }) => {
    return (
        <View key={review.item.id} style={styles.item}>
            <View style={styles.poster}>
                <View >
                    {review.item.avatar
                        ? <Image style={styles.image} source={{ uri: review.item.avatar }} />
                        : <Image style={styles.avatarDefault}
                            source={require('../../assets/image/avatar_default5.png')} />}
                </View>
                <Text>{review.item.name}</Text>
            </View>
            <View style={styles.commentItem}>
                <Rating
                    showRating
                    readonly
                    ratingCount={5}
                    imageSize={20}
                    startingValue={review.item.star}
                    showRating={false}
                    type='custom'
                    tintColor='#fff'
                    ratingBackgroundColor='#ccc'
                />
                <Text>{review.item.comment}</Text>
            </View>
        </View>
    )
}

const ReviewList = ({ reviews, loading }) => {
    const renderItem = (review) => {
        return <ReviewItem review={review}></ReviewItem>
    }
    return (
        <View style={styles.container}>
            {loading ?
                <View style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 9, top: 350}}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }
            {
                !loading && reviews && reviews.length === 0
                    ? <Text style={{ width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center' }}>Chưa có đánh giá</Text>
                    : <FlatList
                        listKey={(item) => item.tracking_code.toString()}
                        scrollEnabled={true}
                        data={reviews}
                        renderItem={renderItem}>
                    </FlatList>
            }

        </View>
    )
}

export default RecipeReviewScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecipeReviews();
    }, [])

    const fetchRecipeReviews = () => {
        setLoading(true);
        getReviewsOfRecipe(id, (recipeReviews => {
            setLoading(false);
            setReviews(recipeReviews);
        }))
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <Text style={styles.title}>Tất cả đánh giá</Text>
            <ReviewList reviews={reviews} loading={loading}></ReviewList>
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
        paddingBottom: 9,
        marginTop: -10
    },
    commentItem: {
        paddingLeft: 65,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
})