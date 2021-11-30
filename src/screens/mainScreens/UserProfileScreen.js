import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Dimensions, Pressable, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from "react-native";
import { Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/core";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'


import { getUserInformation, updateUserInfor } from "../../apis/FoodRecipeApi";
import themes from '../../config/themes';


const w = Dimensions.get("screen").width;

const UserProfileScreen = ({ onPress }) => {
    const [userInfor, setUserInfor] = useState({});
    const [loading, setLoading] = useState(false);
    const [editingControls, setEdittingControls] = useState({
        name: false,
        phoneNumber: false,
        birthDate: false,
    });

    const navigation = useNavigation();
    const onPessMyRecipes = () => {
        navigation.navigate('MyRecipe');
    }

    const onPessMyFavorites = () => {
        navigation.navigate('MyFavorite');
    }

    useEffect(() => {
        fetchUserInfor();
    }, []);

    const fetchUserInfor = () => {
        setLoading(true);
        getUserInformation((data) => {
            setUserInfor(data);
            setLoading(false);
        });
    }

    const onEditingName = () => {
        setEdittingControls({
            ...editingControls,
            name: true,
        });

    }

    const onSaveName = () => {
        setEdittingControls({
            ...editingControls,
            name: false,
        });

        updateUserInformation();
    }

    const onNameChange = (value) => {
        setUserInfor({
            ...userInfor,
            name: value,
        })
    }

    const onEditingPhoneNumber = () => {
        setEdittingControls({
            ...editingControls,
            phoneNumber: true,
        })

    }
    const onSavePhoneNumber = () => {
        setEdittingControls({
            ...editingControls,
            phoneNumber: false,
        });
        updateUserInformation();
    }

    const onPhoneNumberChange = (value) => {
        setUserInfor({
            ...userInfor,
            phoneNumber: value,
        })
    }

    const onSaveSex = (value, _) => {
        setUserInfor({
            ...userInfor,
            sex: value,
        });

        updateUserInfor({ ...userInfor, sex: value }, () => {
        });
    }

    const onEditBirthDate = () => {
        setEdittingControls({
            ...editingControls,
            birthDate: true,
        })
    }

    const onUpdateBirthDate = (date) => {
        setEdittingControls({
            ...editingControls,
            birthDate: false,
        });

        setUserInfor({
            ...userInfor,
            birthDate: date.toISOString(),
        });

        updateUserInfor({ ...userInfor, birthDate: date.toISOString() }, () => {
        });
    }

    const updateUserInformation = () => {
        updateUserInfor(userInfor, () => {
            console.log('Success');
        });
    }

    const onBack = () => navigation.goBack();

    return (
        <SafeAreaView style={{ flex: 1, }}>
            {loading ?
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', zIndex: 99, backgroundColor: 'rgba(2, 156, 89, 0.2)' }}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        style={styles.coverImage}
                        resizeMode="cover"
                        source={require('../../assets/image/thuong2.jpg')}>
                    </Image>
                    <View style={styles.header}>
                        <Pressable onPress={onBack}>
                            <Image source={require('../../assets/icon/back.png')} />
                        </Pressable>
                    </View>
                    <View style={styles.subHeader}>
                        <View style={styles.subHeaderBackground}>
                            <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center' }}>
                                <Image
                                    style={styles.userImg}
                                    source={require('../../assets/image/thuong.jpg')}
                                />
                                <View style={{ position: 'relative', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            editingControls.name ?
                                                <TextInput defaultValue={userInfor.name}
                                                    placeholder='Your name'
                                                    showSoftInputOnFocus={true}
                                                    style={styles.editTextInput}
                                                    maxLength={50}
                                                    onChangeText={onNameChange}>
                                                </TextInput>
                                                :
                                                <Text style={styles.displayUserName}>
                                                    {!!userInfor.name ? userInfor.name : '[Enter your name]'}
                                                </Text>
                                        }

                                    </View>
                                    <View style={{ position: 'absolute', right: -25 }}>
                                        {editingControls.name ?
                                            <Pressable onPress={onSaveName}>
                                                <Image style={styles.editName} source={require('../../assets/icon/save.png')}></Image>
                                            </Pressable> :
                                            <Pressable onPress={onEditingName}>
                                                <Image style={styles.editName} source={require('../../assets/icon/pencil.png')}></Image>
                                            </Pressable>
                                        }
                                    </View>
                                </View>
                            </View>

                            <Pressable style={styles.headerCard}>
                                <Text style={styles.myRecipe} onPress={onPessMyRecipes}> Công thức của tôi</Text>
                                <Text style={styles.favorites} onPress={onPessMyFavorites}> Kho yêu thích </Text>
                            </Pressable>
                        </View>
                    </View>
                    <View>
                        <View style={styles.userInformation}>
                            <Text style={styles.titleInformation}>Thông tin cá nhân</Text>
                            <View style={styles.item}>
                                <View style={styles.titleItem}>
                                    <Image style={styles.icon} source={require('../../assets/icon/calendar.png')} />
                                    <Text style={styles.detailInformation}>
                                        {`Ngày sinh:  `}
                                        {userInfor.birthDate ? new Date(userInfor.birthDate).toDateString() : '01/01/2005'}
                                    </Text>
                                    <DatePicker
                                        modal
                                        androidVariant='iosClone'
                                        mode='date'
                                        locale='vi'
                                        title='Chọn ngày sinh'
                                        confirmText='Xác nhận'
                                        cancelText='Huỷ'
                                        date={userInfor.birthDate ? new Date(userInfor.birthDate) : new Date('2005-01-01')}
                                        open={editingControls.birthDate}
                                        onConfirm={onUpdateBirthDate}
                                        onCancel={() => {
                                            setEdittingControls({
                                                ...editingControls,
                                                birthDate: false,
                                            })
                                        }}
                                    />
                                </View>
                                {editingControls.birthDate ?
                                    null :
                                    <Pressable onPress={onEditBirthDate}>
                                        <Image style={styles.editItem} source={require('../../assets/icon/pencil.png')}></Image>
                                    </Pressable>
                                }

                            </View>

                            <View style={styles.item}>
                                <View style={styles.titleItem}>
                                    <Image style={styles.icon} source={require('../../assets/icon/sex.png')} />
                                    <Text style={styles.detailInformation}>Giới tính: </Text>
                                </View>
                                <View style={styles.picker}>
                                    <Picker
                                        selectedValue={userInfor.sex ?? 'male'}
                                        style={{ height: 50, width: 120, color: '#6b6e6d' }}
                                        onValueChange={onSaveSex}
                                    >
                                        <Picker.Item label="Nữ" value="female" />
                                        <Picker.Item label="Nam" value="male" />
                                        <Picker.Item label="Khác" value="others" />
                                    </Picker>
                                </View>
                            </View>

                            {/* <View style={styles.item}>
                            <View style={styles.titleItem}>
                                <Image style={styles.icon} source={require('../../assets/icon/phone.png')} />
                                <Text style={styles.detailInformation}>Số điện thoại: 0977113803</Text>
                            </View>
                            <Image style={styles.editItem} source={require('../../assets/icon/pencil.png')}></Image>
                        </View> */}
                            <View style={styles.item}>
                                <View style={styles.titleItem}>
                                    <Image style={styles.icon} source={require('../../assets/icon/phone.png')} />
                                    <Text style={styles.detailInformation}> {`Số điện thoại:  `}
                                    </Text>
                                    {
                                        editingControls.phoneNumber ?
                                            <TextInput defaultValue={userInfor.phoneNumber}
                                                placeholder='Your Phone Number'
                                                showSoftInputOnFocus={true}
                                                editable={editingControls.phoneNumber}
                                                style={styles.editTextInput}
                                                onChangeText={onPhoneNumberChange}>
                                            </TextInput>
                                            :
                                            <Text style={styles.displayPhoneNumber}>{!!userInfor.phoneNumber ? userInfor.phoneNumber : '[Enter your phone number]'}</Text>
                                    }
                                </View>
                                {editingControls.phoneNumber ?
                                    <Pressable onPress={onSavePhoneNumber}>
                                        <Image style={styles.editItem} source={require('../../assets/icon/save.png')}></Image>
                                    </Pressable> :
                                    <Pressable onPress={onEditingPhoneNumber}>
                                        <Image style={styles.editItem} source={require('../../assets/icon/pencil.png')}></Image>
                                    </Pressable>
                                }

                            </View>

                            <View style={styles.item}>
                                <View style={styles.titleItem}>
                                    <Image style={styles.icon} source={require('../../assets/icon/email.png')} />
                                    <Text style={styles.detailInformation}>{userInfor.email}</Text>
                                </View >
                            </View>

                            <View style={styles.item}>
                                <View style={styles.titleItem}>
                                    <Image style={styles.icon} source={require('../../assets/icon/password.png')} />
                                    <Text style={styles.detailInformation}>
                                        Ngày tham gia: {new Date(userInfor?.createdAt?.toDate()).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>

                        </View>
                        <View>
                            <Button
                                title="Đăng xuất"
                                buttonStyle={styles.buttonLogOut}
                                titleStyle={styles.buttonTitleLogOut}
                                onPress={() => auth().signOut()}>
                            </Button>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default UserProfileScreen;

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
        marginTop: (w * 121) / 240 - 100,
        height: 190,
        paddingHorizontal: 10,

    },
    subHeaderBackground: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 3,
        marginHorizontal: 5,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
        marginBottom: 15,
    },
    myRecipe: {
        fontSize: 14,
        color: themes.colors.main,
        fontWeight: '500',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 15,
        marginLeft: -37,
        borderColor: themes.colors.main,
    },
    favorites: {
        fontSize: 14,
        color: themes.colors.main,
        fontWeight: '500',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        borderColor: themes.colors.main,

    },
    coverImage: {
        width: w,
        height: (w * 121) / 250,
        position: 'absolute',
        top: 0,
        backgroundColor: 'gray',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: '#fff',
        marginTop: -100,
    },
    item: {
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderColor: '#989c9a',
        marginBottom: 8,
        justifyContent: 'space-between'
    },
    titleItem: {
        flexDirection: 'row',
        alignItems: "center",
    },
    icon: {
        marginBottom: 10,
        marginRight: 15,
        tintColor: themes.colors.main,
        opacity: 0.7,
    },
    editTextInput: {
        fontSize: 16,
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 0,
        borderBottomWidth: 1,
        borderColor: 'rgba(2, 156, 89, 0.5)',
        marginBottom: 10,
    },
    displayUserName: {
        fontSize: 16,
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 0,
        paddingTop: 5,
    },
    displayPhoneNumber: {
        fontSize: 14,
        color: '#6b6e6d',
        marginBottom: 5,
    },
    userInformation: {
        paddingLeft: 15,
    },
    titleInformation: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 5,
        fontWeight: '600',
        color: '#000',
        // color: themes.colors.main,
    },
    detailInformation: {
        fontSize: 16,
        marginVertical: 5,
        paddingBottom: 8,
        color: '#6b6e6d'
    },
    editName: {
        tintColor: themes.colors.main,

    },
    editItem: {
        marginRight: 10,
        tintColor: themes.colors.main,
        opacity: 0.7

    },
    picker: {
        flex: 1,
        alignItems: "center",
        marginTop: -9,
        marginLeft: -150,
    },
    buttonLogOut: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 50,

    },
    buttonTitleLogOut: {
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
    dNone: {
        display: 'none'
    }
});

