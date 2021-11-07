import React from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

import themes from '../../config/themes';


const w = Dimensions.get("screen").width;

const DetailScreen = () => {
    const navigation = useNavigation();
    const renderListIngredients = (index) => {
        return (
            <View style={styles.item} key={index}>
                <Image
                    style={styles.itemImg}
                    resizeMode="contain"
                    source={require('../../assets/icon/ing1.png')}
                />
                <Text style={styles.itemTitle}>Avocado</Text>
                <Text style={styles.desc}>1/2 fruit</Text>
            </View>
        );
    };

    const onBack = () => navigation.goBack();
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                resizeMode="contain"
                source={require('../../assets/icon/img1.png')}
            />
            <View style={styles.header}>
                <Pressable onPress={onBack}>
                    <Image source={require('../../assets/icon/back.png')} />
                </Pressable>
                <Pressable style={styles.buttonHeart}>
                    <Image source={require("../../assets/icon/heart.png")}
                        style={styles.iconHeart}
                        resizeMode="contain" />
                </Pressable>
            </View>

            <View style={styles.subHeader}>
                <View style={styles.body}>
                    <Text style={styles.titleItem}>Fish with couscous</Text>
                    <View style={styles.starCon}>
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <Image key={index}
                                    style={styles.star}
                                    source={require("../../assets/icon/star.png")}
                                />
                            ))}
                    </View>
                    <View style={styles.footerCard}>
                        <View style={styles.footerItem}>
                            <Image source={require("../../assets/icon/clock.png")} />
                            <Text style={styles.footerItemText}>45 min</Text>
                        </View>
                        <Text style={styles.footerItemText}>6 ingredients</Text>
                    </View>


                </View>
            </View>

            <ScrollView style={{
                marginTop: 10,
                flex: 1,
                paddingHorizontal: 10,
                paddingBottom: 56,
            }}>

                <Text style={styles.title}>Ingrdients</Text>
                <ScrollView horizontal>
                    {[1, 3, 4, 5].map((_, index) => renderListIngredients(index))}
                </ScrollView>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
                <View>
                    <Text style={[styles.title, { color: themes.colors.main }]}>Step 1</Text>
                    <Text style={styles.text}>
                        In a small bowl, combine avocado, lemon juice, salt, and pepper.
                        Gently mash with the back of a fork.
                    </Text>
                </View>
            </ScrollView>

        </View>

    );
};

export default DetailScreen;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 45,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flexDirection: 'row',
        width: '100%',
        zIndex: 9999,
    },
    subHeader: {
        marginTop: (w * 121) / 195 - 80,
        height: 120,
        paddingHorizontal: 10,

    },
    titleItem: {
        fontSize: 16,
        fontWeight: '600',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        padding: 10,
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        // shadowRadius: 10,
        elevation: 3,
    },
    starCon: {
        flexDirection: 'row',
        marginVertical: 9,
    },
    star: {
        marginRight: 5,
    },
    footerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
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
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 100,

    },
    image: {
        width: w,
        height: (w * 121) / 195,
        position: 'absolute',
        top: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        marginVertical: 10,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        marginVertical: 8,
    },
    desc: {
        color: 'gray',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    itemImg: {
        width: w / 3,
        height: w / 3,
        borderRadius: 5,
    },
    item: {
        padding: 15,
        paddingVertical: 10,
    },
    text: {
        fontSize: 15,
        color: '#222',
        lineHeight: 25,
    }

});