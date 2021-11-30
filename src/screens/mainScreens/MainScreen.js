import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text, Image, Button, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecipes } from "../../apis/FoodRecipeApi";
import RecipePopular from "../../components/RecipePopular";
import RecipesList from "../../components/RecipesList";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import themes from '../../config/themes';

const MainScreen = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const navigation = useNavigation();
    const onPressItem = (id) => {
        navigation.navigate('Detail', { id, favorites });
    }

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        setLoading(true);
        getRecipes((data) => {
            setRecipes(data);
            setLoading(false);
        });

        const user = auth().currentUser;
        const subscriber = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(documentSnapshot => {
                const data = documentSnapshot.data();
                setFavorites(data.favorites);
            });

        return () => subscriber();
    };


    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <FlatList data={[]} style={styles.container}
                renderItem={null}
                ListFooterComponent={
                    <>
                        <View style={styles.titleGroup}>
                            <Text style={styles.title}>Bạn muốn nấu món gì?</Text>
                            <View style={styles.titleIconCooking}>
                                <Image source={require('../../assets/icon/cooking4.png')}></Image>
                            </View>
                        </View>
                        {/* <View style={styles.searchContainer}>
                            <View style={styles.iconSearch}>
                                <Image source={require('../../assets/icon/search.png')}></Image>
                            </View>
                            <TextInput style={styles.inputSearch} placeholder="Tìm kiếm công thức"></TextInput>
                            <View style={styles.filterButton}>
                                <Image source={require('../../assets/icon/filter.png')}></Image>
                            </View>
                        </View> */}

                        <RecipePopular onPress={onPressItem} />

                        <Text style={styles.titleRecipesList}>Gợi ý cho bạn</Text>

                        <RecipesList onPress={onPressItem} recipes={recipes} favorites={favorites} loading={loading} />
                    </>
                }>

            </FlatList>
        </SafeAreaView>
    )
}
export default MainScreen;

const styles = StyleSheet.create({

    SafeAreaView: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    titleGroup: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 36,
        fontWeight: '500',
        color: '#029c59',
        textShadowColor: 'rgba(130, 237, 191, 0.9)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 7
    },
    titleIconCooking: {
        position: 'absolute',
        left: 60,
        top: 25,
    },
    titleRecipesList: {
        color: themes.colors.main,
        fontSize: 20,
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#e4f2ec',
        borderRadius: 10,
        marginTop: 10,
    },
    filterButton: {
        backgroundColor: themes.colors.main,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    inputSearch: {
        flex: 1,
        padding: 10,
        lineHeight: 0.5,

    },
    iconSearch: {
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
    }
})