import React, { useState, useEffect } from "react";

import { View, Text, SafeAreaView, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";

import RecipesList from "../../components/RecipesList";
import themes from '../../config/themes';
import { getRecipes } from "../../apis/FoodRecipeApi";

const SearchScreen = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    const onPressItem = () => {
        navigation.navigate('Detail');
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
    };

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            {loading ?
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', zIndex: 9, backgroundColor: 'rgba(2, 156, 89, 0.2)' }}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }
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
                            <TextInput style={styles.inputSearch} placeholder="Tìm kiếm công thức"></TextInput>
                            <View style={styles.filterButton}>
                                <Image source={require('../../assets/icon/filter.png')}></Image>
                            </View>
                        </View>

                        <RecipesList onPress={onPressItem} recipes={recipes} />

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
    }
})