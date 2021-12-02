import React from "react";
import { Image, Pressable, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

import themes from "../config/themes";

const w = Dimensions.get('screen').width;

const RecipeItem = ({ onPress, recipe, isFavorite }) => {
    return (
        <Pressable style={styles.item} key={recipe.item.id} onPress={() => onPress(recipe.item.id)}>
            <Image style={styles.image}  source={{uri: recipe.item.image}} />
            <View style={styles.body}>
                <Text style={styles.titleItem}>{recipe.item.name}</Text>
                <View style={styles.starCon}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <Image key={index}
                                style={styles.star}
                                source={require("../assets/icon/star.png")}
                            />
                        ))}
                </View>
                <View style={styles.footerCard}>
                    <View style={styles.footerItem}>
                        <Image source={require("../assets/icon/clock.png")} />
                        <Text style={styles.footerItemText}>{recipe.item.time}</Text>
                    </View>
                    <Text style={styles.footerItemText}>{recipe.item.ingredients.length} Thành phần</Text>
                    {/* <Text style={styles.footerItemText}>
                        Ngày đăng: {new Date(recipe.item.createdAt.toDate()).toLocaleDateString()}
                    </Text> */}
                </View>
                <Pressable style={styles.buttonHeart}>
                    {isFavorite
                        ? <Icon name='favorite' type='material' color='#029c59' />
                        : <Icon name='favorite-border' type='material' color='#029c59' />}
                </Pressable>

            </View>
        </Pressable>
    )
}

export default RecipeItem;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
    },
    starCon: {
        flexDirection: 'row',
        marginVertical: 9,
    },
    star: {
        marginRight: 5,
    },
    titleItem: {
        fontSize: 16,
        fontWeight: '600',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    body: {
        paddingHorizontal: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    line: {
        width: 30,
        height: 2,
        backgroundColor: themes.colors.main,
        alignSelf: 'center',
        marginTop: 3,
    },
    image: {
        width: w / 3.8,
        height: w / 3.8,
        borderRadius: 10,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerItemText: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 10,
        fontWeight: '500',
    },
    iconHeart: {
        tintColor: themes.colors.main,
    },
    buttonHeart: {
        position: 'absolute',
        right: 15,
        top: 1,
    },
    itemScroll: {
        width: w - 30,
    },

})