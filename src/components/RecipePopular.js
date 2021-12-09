import React from "react";
import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import RecipeItemPopular from "./RecipeItemPopular";

import themes from "../config/themes";

const RecipePopular = ({ onPress, recipesPopular, favorites, loading }) => {
    const navigation = useNavigation();
    const onPessButtonViewAll = () => {
        navigation.navigate('MostPopular');
    }

    const renderItem = (recipePopular) => {
        return <RecipeItemPopular
            onPress={onPress}
            recipePopular={recipePopular}
            isFavorite={favorites?.includes(recipePopular.item.id)} />
    };


    return (
        <View style={styles.container}>
            {loading ?
                <View style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 9 }}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }
            <View style={styles.header}>
                <Text style={styles.title}>Phổ biến nhất</Text>
                <Pressable onPress={onPessButtonViewAll}>
                    <Text style={styles.ViewAll} >Xem tất cả</Text>
                </Pressable>
            </View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={styles.ScrollView}>
                <FlatList
                    horizontal
                    data={recipesPopular}
                    listKey={(item) => item.tracking_code.toString()}
                    scrollEnabled={false}
                    renderItem={renderItem}
                />
            </ScrollView>
        </View>
    )
}

export default RecipePopular;
const styles = StyleSheet.create({
    image: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        // shadowRadius: 10,
        elevation: 3,
        borderRadius: 10,
        marginRight: 20,
        marginBottom: 10,

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