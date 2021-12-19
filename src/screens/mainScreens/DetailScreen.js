import React, { useEffect, useState } from "react";
import { TouchableOpacity, ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon, Button } from 'react-native-elements';
import { Modal, ModalContent, SlideAnimation, ModalTitle } from 'react-native-modals';
import { Rating, AirbnbRating } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

import themes from '../../config/themes';
import { submitReview, getRecipeById, updateFavoritesList, updateRecipeStatus, getUserInformation, isRecipeReviewed } from "../../apis/FoodRecipeApi";
import { RECIPE_STATUS } from "../../global/constants";
import { useToast } from "react-native-toast-notifications";

const ReviewPanel = ({ onSubmitReview }) => {

    const [review, setReview] = useState({
        star: 5,
        comment: ''
    });

    return (
        <View style={styles.rate}>
            <AirbnbRating
                count={5}
                reviews={['Món ăn dở tệ', 'Sai công thức', 'Tạm được', 'Khá ngon', 'Xuất sắc']}
                size={20}
                style={{ paddingVertical: 10, fontSize: 11 }}
                defaultRating={review.star}
                onFinishRating={(star) => setReview({
                    ...review,
                    star
                })}
            />
            <TextInput
                placeholder="Nhận xét"
                placeholderTextColor="#666666"
                style={styles.textInput}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={12}
                onChangeText={(val) => setReview({
                    ...review,
                    comment: val
                })}
            />
            <Button
                title='Gửi đánh giá'
                buttonStyle={styles.buttonReviewInPopUp}
                titleStyle={styles.buttonTitleReviewInPopUp}
                onPress={() => onSubmitReview(review)}>
            </Button>
        </View>
    )
}

const w = Dimensions.get("screen").width;

const Step = ({ step, index }) => {
    return (
        <View style={{ paddingBottom: 10 }}>
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
    const toast = useToast();

    const [recipe, setRecipe] = useState({});
    const [userInfor, setUserInfor] = useState({});
    const [loading, setLoading] = useState(false);
    const { id, favorites } = route.params;

    const [favorite, isFavorite] = useState(favorites.includes(id));
    const [tempFavorites, setTempFavorites] = useState([...favorites]);
    const [checkStatus, setCheckStatus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [owner, setOwner] = useState(false);
    const [reviewed, setReviewed] = useState(false);

    useEffect(() => {
        fetchRecipe();
        fetchUserInfor();
        checkIfRecipeReviewed();
    }, []);

    const fetchRecipe = () => {
        setLoading(true);
        getRecipeById(id, (data) => {
            setRecipe(data);
            setOwner(auth().currentUser.uid === data.uid)
            setLoading(false);
            setCheckStatus(data.status !== RECIPE_STATUS.APPROVED);
        })
    };

    const fetchUserInfor = () => {
        setLoading(true);
        getUserInformation((data) => {
            setUserInfor(data);
            setLoading(false);
        });
    }

    const checkIfRecipeReviewed = () => {
        setLoading(true);
        isRecipeReviewed(id, (data) => {
            setReviewed(data);
            setLoading(false);
        });
    }

    const onSubmitReview = (result) => {
        setModalVisible(false);
        const review = {
            ...result,
            uid: auth().currentUser.uid,
            name: userInfor.name ? userInfor.name : auth().currentUser.uid.substring(0, 6),
            avatar: userInfor.avatar ?? '',
            recipeId: id,
        }

        submitReview(review, recipe, () => {
            checkIfRecipeReviewed();
            fetchRecipe();
        })
    }

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

    const updateStatus = (status) => {
        navigation.navigate({
            name: 'Detail',
            params: { id },
            merge: true,
        });

        setLoading(true);
        const ownerId = recipe.uid;
        updateRecipeStatus(id, status, ownerId, () => {

            setLoading(false);
            if (status === RECIPE_STATUS.APPROVED) {
                toast.show("", {
                    type: "custom_toast",
                    animationDuration: 50,
                    data: {
                        title: "Duyệt bài thành công",
                    },
                });
            } else {
                toast.show("", {
                    type: "custom_toast",
                    animationDuration: 50,
                    data: {
                        title: "Từ chối bài đăng",
                    },
                });
            }

            navigation.goBack();

        })
    }

    const navigateToReviewsScreen = () => {
        console.log('navigateToReviewsScreen');
        navigation.navigate('RecipeReview', { id });
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
                    <View style={styles.ratingOverview}>
                        <Rating
                            showRating
                            readonly
                            ratingCount={5}
                            imageSize={20}
                            startingValue={recipe.avgStar}
                            showRating={false}
                        />
                        <TouchableOpacity onPress={() => navigateToReviewsScreen()}>
                            <Text style={{ marginLeft: 5 }}>({recipe.totalReviews} Đánh giá)</Text>
                        </TouchableOpacity>
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
                <View style={styles.poster}>
                    <View style={styles.posterAvatar}>
                    </View>
                    <View>
                        <Text>Nguyen Thi Hoai Thuong</Text>
                        <Text>Ngay dang: 1/1/2021</Text>
                    </View>
                </View>
                <Text style={styles.title}>Các thành phần</Text>
                <ScrollView horizontal>
                    {renderListIngredients()}
                </ScrollView>
                {renderListSteps()}

                {
                    owner || reviewed
                        ? null
                        : <Button onPress={() => setModalVisible(true)}
                            buttonStyle={styles.buttonReview}
                            titleStyle={styles.buttotitleReview}
                            title="Đánh giá công thức">
                        </Button>
                }


                {
                    checkStatus
                        ? <View style={styles.buttonGroup}>
                            <Button
                                title="Duyệt bài"
                                buttonStyle={styles.buttonAcceptRefuse}
                                titleStyle={styles.buttonTitleAcceptRefuse}
                                onPress={() => updateStatus(RECIPE_STATUS.APPROVED)}>
                            </Button>

                            <Button
                                title="Từ chối"
                                buttonStyle={styles.buttonAcceptRefuse}
                                titleStyle={styles.buttonTitleAcceptRefuse}
                                onPress={() => updateStatus(RECIPE_STATUS.DENIED)}>
                            </Button>
                        </View>
                        : null
                }


            </ScrollView>

            <Modal
                visible={modalVisible}
                onTouchOutside={() => {
                    setModalVisible(false);
                }}
                modalAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                modalTitle={<ModalTitle title="Đánh giá công thức" />}
            >
                <ModalContent>
                    <ReviewPanel onSubmitReview={onSubmitReview}></ReviewPanel>
                </ModalContent>
            </Modal>

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
    starIcon: {
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
    },
    poster: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    posterAvatar: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: '#e4e6eb',
        marginRight: 15,
    },
    rate: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 300,
        height: 300,
    },
    titleRate: {
        fontSize: 16,
        color: '#000',
        paddingBottom: 5,

    },
    starRate: {
        flexDirection: 'row',
    },
    buttonSendRate: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        marginTop: -10,
    },

    buttonTitleSendRate: {
        color: themes.colors.main,
        textDecorationLine: 'underline',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
    },

    buttonReview: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 10,
        marginHorizontal: 15,

    },
    buttotitleReview: {
        color: themes.colors.main,
        fontSize: 18,
        fontWeight: '600',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: themes.colors.main,
        paddingHorizontal: 15,
        paddingVertical: 7,
        width: 350,

    },
    buttonReviewInPopUp: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 15,
    },
    buttonTitleReviewInPopUp: {
        color: '#fff',
        backgroundColor: themes.colors.main,
        fontSize: 18,
        fontWeight: '600',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: themes.colors.main,
        paddingHorizontal: 15,
        paddingVertical: 7,

    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    buttonAcceptRefuse: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 10,
        marginHorizontal: 15,

    },
    buttonTitleAcceptRefuse: {
        color: '#fff',
        backgroundColor: themes.colors.main,
        fontSize: 18,
        fontWeight: '600',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: themes.colors.main,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    textInput: {
        marginVertical: 15,
        width: '100%',
        paddingLeft: 10,
        color: '#05375a',
        borderWidth: 1,
        borderColor: themes.colors.main,
        borderRadius: 5,
        height: 150,
    },
    ratingOverview: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    }

});