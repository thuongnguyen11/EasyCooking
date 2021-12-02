import React from "react";
import { useNavigation } from "@react-navigation/core";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

import themes from "../config/themes";


const RecipeItemPopular = ({ onPress, recipePopular, isFavorite }) => {
    return (
        <Pressable style={styles.itemContainer} key={recipePopular.item.id} onPress={() => onPress(recipePopular.item.id)} >
            <Image style={styles.image} source={{uri: recipePopular.item.image}} />
            <View style={styles.cardItem}>
                <Text style={styles.titleItem}>{recipePopular.item.name}</Text>
                <View style={styles.starCon}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <Image key={index} style={styles.star} source={require("../assets/icon/star.png")} />))}
                </View>

                <View style={styles.footerItem}>
                    <Image source={require("../assets/icon/clock.png")} />
                    <Text style={styles.footerItemText}>{recipePopular.item.time}</Text>
                </View>
            </View>
            <Pressable style={styles.buttonHeart}>
                {isFavorite
                    ? <Icon name='favorite' type='material' color='#029c59' />
                    : <Icon name='favorite-border' type='material' color='#029c59' />}
            </Pressable>

        </Pressable>
    )
}



export default RecipeItemPopular;
const styles = StyleSheet.create({
    image: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        height: 135,
        borderWidth: 1,

    },
    ScrollView: {
        // paddingLeft: 10,
        // // paddingVertical: 10,
    },
    title: {
        color: themes.colors.text,
        fontSize: 20,
        fontWeight: '600',
    },
    titleItem: {
        color: themes.colors.text,
        fontSize: 17,
        fontWeight: '600',
    },
    itemContainer: {
        backgroundColor: '#fff',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height:  2},
        shadowOpacity: 0.3,
        // shadowRadius: 10,
        elevation: 5,
        borderRadius: 10,
        marginRight: 20,
        marginBottom: 10,
        width: 200,
    },
    footerItemText: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 10,
        fontWeight: '500',

    },
    starCon: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    star: {
        marginRight: 10,
    },
    ViewAll: {
        color: themes.colors.main,
        color: '#888A82',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    container: {
        paddingVertical: 10,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardItem: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    buttonHeart: {
        padding: 10,
        backgroundColor: '#FFF',
        position: 'absolute',
        right: 10,
        top: 10,
        borderRadius: 100,
    },

});