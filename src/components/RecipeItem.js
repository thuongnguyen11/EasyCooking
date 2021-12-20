import React, { useState } from "react";
import { Image, Pressable, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Icon, Rating } from 'react-native-elements';
import { useNavigationState } from "@react-navigation/core";
import { Modal, ModalFooter, ModalButton, ModalContent, SlideAnimation, ModalTitle } from 'react-native-modals';


import themes from "../config/themes";
import { color } from "react-native-elements/dist/helpers";
import { Colors } from "react-native/Libraries/NewAppScreen";

const w = Dimensions.get('screen').width;



const RecipeItem = ({ onPress, recipe, isFavorite, onEdit, onDelete }) => {
    const routes = useNavigationState(state => state.routes);
    const canEdit = routes.slice(-1)[0].name === 'MyRecipe';
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    return (
        <Pressable style={styles.container} key={recipe.item.id} onPress={() => onPress(recipe.item.id)}>
            {
                canEdit
                    ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.postDate} >
                            Ngày đăng: {new Date(recipe.item.createdAt.toDate()).toLocaleDateString()}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable onPress={() => onEdit(recipe.item.id)}>
                                <Image style={{ marginRight: 10 }} source={require('../assets/icon/pencil.png')} ></Image>
                            </Pressable>
                            <Icon name='dehaze' style='material' onPress={() => setShowDeleteModal(true)}></Icon>
                        </View>
                    </View>
                    : null
            }

            <Modal
                visible={showDeleteModal}
                onTouchOutside={() => {
                    setModalVisible(false);
                }}
                modalAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                modalTitle={<ModalTitle title="Bạn muốn xóa công thức này?" />}
                footer={
                    <ModalFooter>
                        <ModalButton
                            textStyle={{color: '#029c59'}}
                            text="Hủy bỏ"
                            onPress={() => setShowDeleteModal(false)}
                        />
                        <ModalButton
                            textStyle={{color: '#029c59'}}
                            text="Xóa"
                            onPress={() => {
                                onDelete(recipe.item.id);
                                setShowDeleteModal(false);
                            }}
                        />
                    </ModalFooter>
                }
            >
                <ModalContent>
                    <Text>Bạn có chắc chắn muốn xoá món {recipe.item.name} không?</Text>
                </ModalContent>
            </Modal>

            <View style={styles.item}>
                <Image style={styles.image} source={{ uri: recipe.item.image }} />
                <View style={styles.body}>
                    <Text style={styles.titleItem}>{recipe.item.name}</Text>
                    <View style={styles.starCon}>
                        <View style={styles.ratingOverview}>
                            <Rating
                                showRating
                                readonly
                                ratingCount={5}
                                imageSize={20}
                                startingValue={recipe.item.avgStar}
                                showRating={false}
                            />
                        </View>
                    </View>
                    <View style={styles.footerCard}>
                        <View style={styles.footerItem}>
                            <Image source={require("../assets/icon/clock.png")} />
                            <Text style={styles.footerItemText}>{recipe.item.time}</Text>
                        </View>
                        <Text style={styles.footerItemText}>{recipe.item.ingredients.length} Thành phần</Text>

                    </View>
                    <Pressable style={styles.buttonHeart}>
                        {isFavorite
                            ? <Icon name='favorite' type='material' color='#029c59' />
                            : <Icon name='favorite-border' type='material' color='#029c59' />}
                    </Pressable>

                </View>
            </View>
        </Pressable>
    )
}

export default RecipeItem;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
    },
    container: {
        marginTop: 15,
    },

    titleItem: {
        fontSize: 15,
        fontWeight: '600',
        paddingRight: 40,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starCon: {
        flexDirection: 'row',
        marginVertical: 9,
    },
    body: {
        paddingLeft: 16,
        paddingRight: 5,
        flex: 1,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    line: {
        width: 30,
        height: 2,
        backgroundColor: themes.colors.main,
        alignSelf: 'center',
        marginTop: 3,
    },
    image: {
        width: w / 3.8,
        height: w / 3.8,
        borderRadius: 10,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        position: 'absolute',
        right: 5,
        top: 1,
    },
    itemScroll: {
        width: w - 30,
    },

})