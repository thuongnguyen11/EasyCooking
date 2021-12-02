import React, { useState, useEffect } from "react";

import { View, Text, SafeAreaView, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import RecipesList from "../../components/RecipesList";
import themes from '../../config/themes';
import { getRecipes, searchRecipe, getMyRecipes} from "../../apis/FoodRecipeApi";
import { removeVietnameseTones } from "../../global/utilities";



const MyRecipeScreen = ({ navigation }) => {
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
        getMyRecipes((data) => {
            setRecipes(data);
            setLoading(false);
        });
       
    };

    return (
        <SafeAreaView style={styles.SafeAreaView}>

            <FlatList data={[]} style={styles.container}
                renderItem={null}
                ListFooterComponent={
                    <>
                        <View style={styles.titleGroup}>
                            <Text style={styles.title}>Công thức của tôi</Text>
                            
                        </View>

                        <RecipesList onPress={onPressItem} recipes={recipes} favorites={favorites} loading={loading} />
                    </>
                }>


            </FlatList>
        </SafeAreaView>
    )
}
export default MyRecipeScreen;

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
        textShadowRadius: 7,
        textAlign: 'center',
        flex: 1,
        marginBottom: 10,
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

    
})