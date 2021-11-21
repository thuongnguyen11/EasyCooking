import React, { useState } from "react";
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import themes from "../config/themes";
import RecipeItem from "./RecipeItem";

const w = Dimensions.get('screen').width;

const RecipesList = ({ onPress, recipes }) => {
    const [selected, setSelected] = useState(0);

    const onScroll = ({ nativeEvent }) => {
        const index = Math.round(nativeEvent.contentOffset.x / (w - 20));
        setSelected(index);
    }

    const renderItem = (recipe) => (
        <RecipeItem onPress={onPress} recipe={recipe} />
    );

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                onScroll={onScroll}
                snapToAlignment='center'
                decelerationRate='fast' >
                <View style={styles.itemScroll} >
                    <FlatList
                        data={recipes}
                        listKey={(item) => item.tracking_code.toString()}
                        scrollEnabled={false}
                        renderItem={renderItem}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default RecipesList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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

    // line: {
    //     width: 30,
    //     height: 2,
    //     backgroundColor: themes.colors.main,
    //     alignSelf: 'center',
    //     marginTop: 3,
    // },
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