import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import themes from "../../config/themes";

const RecipePopular = ({ onPress }) => {
    const renderItem = (i) => {
        return (
            <Pressable style={styles.itemContainer} key={i} onPress={onPress} >
                <Image style={styles.image} source={require("../../assets/icon/img1.png")} />
                <View style={styles.cardItem}>
                    <Text style={styles.titleItem}>Avocado Toast</Text>
                    <View style={styles.starCon}>
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <Image key={index} style={styles.star} source={require("../../assets/icon/star.png")} />))}
                    </View>

                    <View style={styles.footerItem}>
                        <Image source={require("../../assets/icon/clock.png")} />
                        <Text style={styles.footerItemText}>5 min</Text>
                    </View>
                </View>
                <Pressable style={styles.buttonHeart} >
                    <Image source={require("../../assets/icon/heart.png")}
                        style={styles.iconHeart}
                        resizeMode="contain" />
                </Pressable>

            </Pressable>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Most popular</Text>
                <Pressable>
                    <Text style={styles.ViewAll}>View All</Text>
                </Pressable>
            </View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={styles.ScrollView}>
                {[1, 2, 3].map((_, i) => renderItem(i))}
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