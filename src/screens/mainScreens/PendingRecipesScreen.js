import React, { useState, useEffect } from "react";

import { View, Text, SafeAreaView, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import RecipesList from "../../components/RecipesList";
import { COLLECTION_NAME, RECIPE_STATUS } from "../../global/constants";

const PendingRecipesScreen = ({ route, navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);


    const onPressItem = (id) => {
        navigation.navigate('Detail', { id, favorites });
    }

    useEffect(() => {
        const user = auth().currentUser;
        const subscriber = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot) {
                    const data = documentSnapshot.data();
                    setFavorites(data.favorites);
                }
            });

        return () => subscriber();
    }, []);

    useEffect(() => {
        setLoading(true);
        const subscriber = firestore().collection(COLLECTION_NAME.RECIPES)
            .where('status', '==', RECIPE_STATUS.PENDING)
            .onSnapshot(documentSnapshot => {
                const data = documentSnapshot.docs.map(s => {
                    return {
                        id: s.id,
                        ...s.data(),
                    }
                });

                setRecipes(data);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    return (
        <SafeAreaView style={styles.SafeAreaView}>

            <FlatList data={[]} style={styles.container}
                renderItem={null}
                ListFooterComponent={
                    <>
                        <View style={styles.titleGroup}>
                            <Text style={styles.title}>Danh sách chờ</Text>
                            <Text style={styles.title}> phê duyệt</Text>
                        </View>
                        <RecipesList onPress={onPressItem} recipes={recipes} favorites={favorites} loading={loading} />
                    </>
                }>


            </FlatList>
        </SafeAreaView>
    )
}

export default PendingRecipesScreen;


const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    titleGroup: {
    },

    title: {
        fontSize: 30,
        fontWeight: '500',
        color: '#029c59',
        textShadowColor: 'rgba(130, 237, 191, 0.9)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 7,
        textAlign: 'center',
        flex: 1,
        lineHeight:30,
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