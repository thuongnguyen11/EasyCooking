import React, { useState, useEffect } from "react";

import { View, Text, SafeAreaView, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import RecipesList from "../../components/RecipesList";
import themes from '../../config/themes';
import { getRecipes, searchRecipe, getApprovedRecipes } from "../../apis/FoodRecipeApi";
import { removeVietnameseTones } from "../../global/utilities";

const SearchScreen = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const onPressItem = (id) => {
        navigation.navigate('Detail', { id, favorites });
    }

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        const user = auth().currentUser;
        const subscriber = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(documentSnapshot => {
                const data = documentSnapshot.data();
                setFavorites(data.favorites);
            });

        return () => subscriber();
    }, []);

    const fetchRecipes = () => {
        setLoading(true);
        getApprovedRecipes((data) => {
            setRecipes(data);
            setLoading(false);
        });
    };


    const onSubmit = (data) => {
        setLoading(true);

        const searchTerm = removeVietnameseTones(data.text.toLowerCase());

        searchRecipe(searchTerm, (result) => {
            setRecipes(result);
            setLoading(false);
        });
    }

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

                        <View style={styles.searchContainer}>
                            <View style={styles.iconSearch}>
                                <Image source={require('../../assets/icon/search.png')}></Image>
                            </View>
                            <TextInput
                                style={styles.inputSearch} placeholder="Tìm kiếm công thức"
                                onSubmitEditing={({ nativeEvent }) => onSubmit(nativeEvent)}
                            >

                            </TextInput>
                            <View style={styles.filterButton}>
                                <Image source={require('../../assets/icon/filter.png')}></Image>
                            </View>
                        </View>
                        <RecipesList onPress={onPressItem} recipes={recipes} favorites={favorites} loading={loading} />
                    </>
                }>


            </FlatList>
        </SafeAreaView>
    )
}

export default SearchScreen;


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
    },
    loading: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        zIndex: 9,
        // backgroundColor: 'rgba(218, 247, 234,0.2)',

    },

    notFound: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 250,
    },
    // notFoundImage: {
    //     width: '30%',
    //     height: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // }
})