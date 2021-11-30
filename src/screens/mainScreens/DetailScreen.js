import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import themes from '../../config/themes';
import { getRecipeById, updateFavoritesList } from "../../apis/FoodRecipeApi";

const w = Dimensions.get("screen").width;

const Step = ({ step, index }) => {
    return (
        <View>
            <Text style={[styles.title, { color: themes.colors.main }]}>Bước {index + 1}</Text>
            <Text style={styles.text}>
                {step}
            </Text>
        </View>
    );
};

const Ingredient = ({ ingredient, index }) => {
    return (
        <View style={styles.item} key={index}>

            <Image
                style={styles.itemImg}
                resizeMode="cover"
                source={{ uri: ingredient.image }}
            />
            <Text style={styles.itemTitle}>{ingredient.name}</Text>
            <Text style={styles.desc}>{ingredient.amount}</Text>
        </View>
    )
}

const DetailScreen = ({ route, navigation }) => {
    const [recipe, setRecipe] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id, favorites } = route.params;

    const [favorite, isFavorite] = useState(favorites.includes(id));
    const [tempFavorites, setTempFavorites] = useState([...favorites]);

    useEffect(() => {
        fetchRecipe();
    }, []);

    const fetchRecipe = () => {
        setLoading(true);
        getRecipeById(id, (data) => {
            setRecipe(data);
            setLoading(false);
        })
    };

    const toggleFavorite = () => {
        isFavorite(!favorite);

        let updated = [...tempFavorites];
        if (updated.includes(id)) {
            updated = updated.filter(r => r !== id);
        } else {
            updated.push(id);
        }

        updateFavoritesList(updated, () => {
            setTempFavorites([...updated]);
        });
    };


    const renderListIngredients = () => {
        const ingredients = recipe.ingredients?.map((ingredient, index) => {
            return (
                <Ingredient ingredient={ingredient} index={index} key={index}></Ingredient>
            );
        })
        return ingredients;
    };

    const renderListSteps = () => {
        const steps = recipe.steps?.map((step, index) => {
            return (
                <Step step={step} index={index} key={index} />
            )
        });

        return steps;
    }

    const onBack = () => navigation.goBack();
    return (
        <View style={styles.container}>
            {loading ?
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', zIndex: 99, backgroundColor: 'rgba(2, 156, 89, 0.2)' }}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }

            <Image
                style={styles.image}
                resizeMode="cover"
                source={{ uri: recipe.image }}
            />
            <View style={styles.header}>
                <Pressable onPress={onBack}>
                    <Image source={require('../../assets/icon/back.png')} />
                </Pressable>
                <Pressable style={styles.buttonHeart}
                    onPress={() => toggleFavorite()}>
                    {favorite
                        ? <Icon name='favorite' type='material' color='#029c59' />
                        : <Icon name='favorite-border' type='material' color='#029c59' />}
                </Pressable>
            </View>

            <View style={styles.subHeader}>
                <View style={styles.body}>
                    <Text style={styles.titleItem}>{recipe.name}</Text>
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
                            <Text style={styles.footerItemText}>{recipe.time}</Text>
                        </View>
                        <Text style={styles.footerItemText}>{recipe.ingredients?.length} Thành phần</Text>
                    </View>


                </View>
            </View>

            <ScrollView style={{
                marginTop: 10,
                flex: 1,
                paddingHorizontal: 10,
                paddingBottom: 56,
            }}>

                <Text style={styles.title}>Các thành phần</Text>
                <ScrollView horizontal>
                    {renderListIngredients()}
                </ScrollView>
                {renderListSteps()}
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
        zIndex: 10,
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