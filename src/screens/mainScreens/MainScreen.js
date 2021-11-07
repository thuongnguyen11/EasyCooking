import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, ScrollView, View, Text, Image, Button, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipePopular from "../../assets/components/RecipePopular";
import TabRecipe from "../../assets/components/TabRecipe";

import themes from '../../config/themes';


const MainScreen = () => {
    const navigation = useNavigation();
    const onPressItem = () => {
        navigation.navigate('Detail');
    }
    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <FlatList data={[]} style={styles.container}
                renderItem={null}
                ListFooterComponent={
                    <>
                        <Text style={styles.title}>What would you like to cook?</Text>
                        <View style={styles.searchContainer}>
                            <View style={styles.iconSearch}>
                                <Image source={require('../../assets/icon/search.png')}></Image>
                            </View>
                            <TextInput style={styles.inputSearch} placeholder="Find a recipe"></TextInput>
                            <View style={styles.filterButton}>
                                <Image source={require('../../assets/icon/filter.png')}></Image>
                            </View>
                        </View>

                        <RecipePopular onPress={onPressItem} />
                        <TabRecipe onPress={onPressItem} />
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
    title: {
        fontSize: 30,
        fontWeight: '500',
        color: '#41423F'
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