import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text, Image, Button, TextInput, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecipes, getApprovedRecipes, getPopularRecipes } from "../../apis/FoodRecipeApi";
import RecipePopular from "../../components/RecipePopular";
import RecipesList from "../../components/RecipesList";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import themes from '../../config/themes';
import { Icon } from "react-native-elements";


const MainScreen = () => {
    const [recipesPopular, setRecipesPopular] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigation = useNavigation();
    const onPressItem = (id) => {
        navigation.navigate('Detail', { id, favorites });
    }



    const onPressIconPending = () => {
        navigation.navigate('PendingRecipes');
    }

    useEffect(() => {
        fetchRecipes();
    }, []);


    const fetchRecipes = () => {
        setLoading(true);
        getApprovedRecipes((data) => {
            const numberElementsDisplay = 5;

            const recipeRandom = data
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, numberElementsDisplay);

            setLoading(false);
            setRecipes(recipeRandom);
        });
        
        getPopularRecipes((data) => {
            setRecipesPopular(data);
            setLoading(false);
        })

        const user = auth().currentUser;
        const subscriber = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(documentSnapshot => {
                if (!!documentSnapshot) {
                    const data = documentSnapshot.data();
                    setFavorites(data.favorites);
                    setIsAdmin(data.type === 'ADMIN');
                }
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
                            {/* <Text style={styles.title}>Bạn muốn nấu món gì?</Text> */}
                            <View style={styles.titleIconCooking}>
                                <Image source={require('../../assets/image/logo4.png')} style={{
                                    width: 180,
                                    height: 87,
                                }}></Image>
                            </View>
                            {
                                isAdmin
                                    ? <Pressable onPress={onPressIconPending}>
                                        <Icon name='pending-actions' size={35} color={themes.colors.main}></Icon>
                                    </Pressable>
                                    : null
                            }

                        </View>

                        <View style={{ height: 280 }}>
                            <RecipePopular onPress={onPressItem} recipesPopular={recipesPopular} favorites={favorites} loading={loading} />
                        </View>
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
        justifyContent: 'space-between',
        alignItems: "flex-end",
    },
    // title: {
    //     fontSize: 36,
    //     fontWeight: '500',
    //     color: '#029c59',
    //     textShadowColor: 'rgba(130, 237, 191, 0.9)',
    //     textShadowOffset: { width: 2, height: 2 },
    //     textShadowRadius: 7
    // },
    titleIconCooking: {

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