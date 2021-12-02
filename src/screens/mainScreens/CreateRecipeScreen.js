import React, { useState, useEffect, useRef } from "react";

import {
    View, Text,
    TextInput, StyleSheet,
    SafeAreaView, TouchableOpacity,
    FlatList, ImageBackground,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';


import Icon from 'react-native-vector-icons/FontAwesome5';
const shortid = require('shortid');
import { useToast } from "react-native-toast-notifications";

import themes from '../../config/themes';
import bgimage from '../../assets/image/bg7.png';
import CustomImagePicker from "../../components/CustomImagePicker";
import UploadImage from "../../components/UploadImage";
import { createRecipe } from '../../apis/FoodRecipeApi';


const CreateRecipeScreen = ({ navigation }) => {
    const toast = useToast();

    useEffect(() => {
        global["toast"] = toast;
    }, []);

    const [loading, setLoading] = useState(false);

    const [dishImage, setDishImage] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Món xào');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [ingredients, setIngredients] = useState([
        { id: shortid.generate(), name: '', amount: 0, uri: null }
    ]);
    const [steps, setSteps] = useState([
        { id: shortid.generate(), step: '' }
    ]);
    const [input, setInput] = useState({
        isValidDishImage: false,
        isValidName: false,
        isValidDescription: false,
        isValidIngredientName: false,
        isValidIngredientAmount: false,
        isValidStep: false,
        isValidTime: false,
        isSubmited: false,
    });

    const resetState = () => {
        setLoading(false);
        setDishImage(null);
        setName('');
        setCategory('Món xào');
        setDescription('');
        setTime('');
        setIngredients([{ id: shortid.generate(), name: '', amount: 0, uri: null }]);
        setSteps([{ id: shortid.generate(), step: '' }]);

        setInput({
            isValidDishImage: false,
            isValidName: false,
            isValidDescription: false,
            isValidIngredientName: false,
            isValidIngredientAmount: false,
            isValidStep: false,
            isValidTime: false,
            isSubmited: false,
        });
    }

    const onChangeCategory = (value) => {
        setCategory(value);
    }

    const onSubmit = async () => {

        setInput({
            ...input,
            isSubmited: true,
        });

        const { isSubmited, ...controlStates } = input;

        if (Object.values(controlStates).every(state => !!state)) {
            const recipe = {
                name,
                image: dishImage,
                category,
                description,
                ingredients,
                steps: steps.map(step => step.step),
                time
            };

            setLoading(true);

            const callback = () => {
                setLoading(false);

                toast.show("Bài đăng của bạn sẽ được phê duyệt trong vòng 24 giờ.", {
                    type: "custom_toast",
                    animationDuration: 50,
                    data: {
                        title: "Đang chờ phê duyệt",
                    },
                });

                resetState();

                navigation.goBack();
            };

            createRecipe(recipe, callback);

            return;

        } else {
            console.log('not ok');
            return;
        }

    }

    const showValidationMessage = (field) => !input[field] && input.isSubmited;

    const handleValidDishImage = (value) => {
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value) {
            setInput({
                ...input,
                isValidDishImage: false
            });
        } else {
            setDishImage(value);
            setInput({
                ...input,
                isValidDishImage: true
            });
        }
    }

    const handleValidName = (value) => {
        console.log(value);

        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidName: false
            });
        } else {
            setInput({
                ...input,
                isValidName: true
            });
        }
    }

    const handleValidCategory = (value) => {
        console.log(value);
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidCategory: false
            });
        } else {
            setInput({
                ...input,
                isValidCategory: true
            });
        }
    }

    const handleValidDescription = (value) => {
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidDescription: false
            });
        } else {
            setInput({
                ...input,
                isValidDescription: true
            });
        }
    }

    const handleValidIngredientName = (value) => {
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidIngredientName: false
            });
        } else {
            setInput({
                ...input,
                isValidIngredientName: true
            });
        }
    }

    const handleValidIngredientAmount = (value) => {
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidIngredientAmount: false
            });
        } else {
            setInput({
                ...input,
                isValidIngredientAmount: true
            });
        }
    }

    const handleValidStep = (value) => {
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidStep: false
            });
        } else {
            setInput({
                ...input,
                isValidStep: true
            });
        }
    }

    const handleValidTime = (value) => {
        setInput({
            ...input,
            isSubmited: false,
        });

        if (!value.trim()) {
            setInput({
                ...input,
                isValidTime: false
            });
        } else {
            setInput({
                ...input,
                isValidTime: true
            });
        }
    }

    const addIngredientInput = () => {
        const inputs = [...ingredients];
        inputs.push({ id: shortid.generate(), name: '', amount: 0, uri: null });
        setIngredients(inputs);
    }

    const removeIngredientInput = (id) => {
        const inputs = [...ingredients];
        const index = inputs.findIndex(i => i.id === id);
        inputs.splice(index, 1);
        setIngredients(inputs);
    }

    const updateIngredientName = (value, ingredientId) => {
        const inputs = [...ingredients];
        const target = inputs.find(i => ingredientId === i.id);
        target.name = value;
        setIngredients(inputs);
    }

    const updateIngredientAmount = (value, ingredientId) => {
        const inputs = [...ingredients];
        const target = inputs.find(i => ingredientId === i.id);
        target.amount = value;
        setIngredients(inputs);
    }

    const updateIngredientImage = ({ uri }, ingredientId) => {
        const inputs = [...ingredients];
        const target = inputs.find(i => ingredientId === i.id);
        target.uri = uri;
        setIngredients(inputs);
    }

    const getIngredientControls = () => {
        return ingredients.map((ingredient, index) => {
            return (
                <View key={ingredient.id} style={styles.ingredientInputGroup}>
                    {index !== 0 ? <TouchableOpacity activeOpacity={0.5} style={styles.deleteButton}
                        onPress={() => removeIngredientInput(ingredient.id)}>
                        <Icon
                            style={styles.iconDelete}
                            name="times-circle"
                            size={24}
                        ></Icon>
                    </TouchableOpacity> :
                        <TouchableOpacity style={{ marginLeft: 5, }}
                            onPress={() => removeIngredientInput(ingredient.id)}>
                            <Icon
                                style={styles.iconDelete2}
                                name="times-circle"
                                size={24}
                            ></Icon>
                        </TouchableOpacity>}

                    <View style={styles.flexRow}>
                        <CustomImagePicker onImagePicked={(uri) => updateIngredientImage(uri, ingredient.id)} />
                        <View style={styles.flexColumn}>
                            <TextInput
                                style={[styles.input, styles.ingredientNameInput, showValidationMessage('isValidIngredientName') ? styles.borderInputErrIngredient : null]}
                                placeholder='vd: Rau xanh'
                                onChangeText={(value) => updateIngredientName(value, ingredient.id)}
                                onEndEditing={(e) => handleValidIngredientName(e.nativeEvent.text)}
                            />
                            {showValidationMessage('isValidIngredientName') ?
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsgIngredient}>Tên nguyên liệu không được để trống</Text>
                                </Animatable.View> : null
                            }
                            <TextInput
                                style={[styles.input, styles.ingredientAmountInput, showValidationMessage('isValidIngredientAmount') ? styles.borderInputErrIngredient : null]}
                                placeholder='vd: 1kg'
                                onChangeText={(value) => updateIngredientAmount(value, ingredient.id)}
                                onEndEditing={(e) => handleValidIngredientAmount(e.nativeEvent.text)}
                            />
                            {showValidationMessage('isValidIngredientAmount') ?
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsgIngredient}>Số lượng không được để trống</Text>
                                </Animatable.View> : null
                            }
                        </View>
                    </View>
                </View>
            );
        })
    }

    const addStepInput = () => {
        const inputSteps = [...steps];
        inputSteps.push({ id: shortid.generate(), step: '' });
        setSteps(inputSteps);
    }

    const removeStepInput = (id) => {
        const inputSteps = [...steps];
        const indexStep = inputSteps.findIndex(step => step.id === id);
        inputSteps.splice(indexStep, 1);
        setSteps(inputSteps);
    }

    const updateStepName = (value, stepId) => {
        const inputSteps = [...steps];
        const targetStep = inputSteps.find(step => stepId === step.id);
        targetStep.step = value;
        setSteps(inputSteps);
    }

    const getStepControls = () => {
        return steps.map((step, indexStep) => {
            return <View key={step.id}>
                <TextInput
                    style={[styles.input, styles.stepNameInput, showValidationMessage('isValidStep') ? styles.borderInputError : null]}
                    placeholder={`Buoc ${indexStep + 1}: ...`}
                    onChangeText={(value) => updateStepName(value, step.id)}
                    onEndEditing={(e) => handleValidStep(e.nativeEvent.text)}
                />
                {showValidationMessage('isValidStep') ?
                    errorMsg('Các bước thực hiện') : null
                }
                {indexStep !== 0 ? <TouchableOpacity style={styles.deleteButtonStep}
                    onPress={() => removeStepInput(step.id)}>
                    <Icon
                        style={styles.iconDelete}
                        name="times-circle"
                        size={24}
                    ></Icon>
                </TouchableOpacity> : <></>}

            </View>
        });
    }

    const errorMsg = (prefix) => (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{`${prefix} không được để trống`}</Text>
        </Animatable.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ?
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', zIndex: 9, backgroundColor: 'rgba(2, 156, 89, 0.2)' }}>
                    <ActivityIndicator size="large" color="red" />
                </View>
                : null
            }
            <ImageBackground source={bgimage} style={styles.backgroundImage}>
                <FlatList data={[]} style={styles.body}
                    renderItem={null}
                    ListFooterComponent={
                        <>
                            <Text style={styles.title}>Tạo bài đăng</Text>
                            <UploadImage dishImage={dishImage} onDishImagePicked={(uri) => handleValidDishImage(uri)}></UploadImage>
                            {showValidationMessage('isValidDishImage') ?
                                errorMsg('Hình ảnh') : null
                            }
                            <View>
                                <Text style={styles.titleIttem}>Tên món ăn</Text>
                                <TextInput
                                    style={[styles.input, showValidationMessage('isValidName') ? styles.borderInputError : null]}
                                    placeholder='Bún đậu mắm tôm'
                                    value={name}
                                    onChangeText={name => setName(name)}
                                    onEndEditing={(e) => handleValidName(e.nativeEvent.text)}
                                />
                                {showValidationMessage('isValidName') ?
                                    errorMsg('Tên món ăn') : null
                                }
                            </View>
                            <View>
                                <Text style={styles.titleIttem}>Phân loại</Text>
                                <View style={styles.dropdownCategory}>
                                    <Picker
                                        selectedValue={category}
                                        style={styles.pickerCategory}
                                        onValueChange={onChangeCategory}                                    >
                                        <Picker.Item label="Món hấp" value="Món hấp" />
                                        <Picker.Item label="Món luộc" value="Món luộc" />
                                        <Picker.Item label="Món xào" value="Món xào" />
                                        <Picker.Item label="Món chiên" value="Món chiên" />
                                        <Picker.Item label="Khác" value="Khác" />

                                    </Picker>
                                </View>
                                {/* <TextInput
                                    placeholder='Món nưóc'
                                    value={category}
                                    style={[styles.input, showValidationMessage('isValidCategory') ? styles.borderInputError : null]}
                                    onChangeText={category => setCategory(category)}
                                    onEndEditing={(e) => handleValidCategory(e.nativeEvent.text)}
                                />
                                {showValidationMessage('isValidCategory') ?
                                    errorMsg('Phân loại') : null
                                } */}
                            </View>
                            <View>
                                <Text style={styles.titleIttem}>Mô tả</Text>
                                <View style={[styles.textArea, showValidationMessage('isValidDescription') ? styles.borderInputError : null]}>
                                    <TextInput
                                        value={description}
                                        style={styles.input}
                                        multiline={true}
                                        numberOfLines={10}
                                        style={{ height: 100, textAlignVertical: 'top', }}
                                        placeholder='Nhập mô tả: '
                                        onChangeText={description => setDescription(description)}
                                        onEndEditing={(e) => handleValidDescription(e.nativeEvent.text)}
                                    />
                                </View>
                                {showValidationMessage('isValidDescription') ?
                                    errorMsg('Mô tả') : null
                                }
                            </View>
                            <View>
                                <Text style={styles.titleIttem}>Nguyên liệu</Text>
                                {getIngredientControls()}
                                <Button
                                    title="Thêm nguyên liệu"
                                    buttonStyle={styles.buttonAddRow}
                                    titleStyle={styles.buttonTitleAddRow}
                                    onPress={() => addIngredientInput()}
                                />
                            </View>

                            <View>
                                <Text style={styles.titleIttem}>Các bước thực hiện</Text>
                                {getStepControls()}
                                <Button
                                    title="Thêm bước"
                                    buttonStyle={styles.buttonAddRow}
                                    titleStyle={styles.buttonTitleAddRow}
                                    onPress={() => addStepInput()}
                                />
                            </View>
                            <View>
                                <Text style={styles.titleIttem}>Thời gian</Text>
                                <TextInput
                                    style={[styles.input, showValidationMessage('isValidTime') ? styles.borderInputError : null]}
                                    placeholder='1 giờ 15 phút'
                                    value={time}
                                    onChangeText={time => setTime(time)}
                                    onEndEditing={(e) => handleValidTime(e.nativeEvent.text)}
                                />
                                {showValidationMessage('isValidTime') ?
                                    errorMsg('Thời gian') : null
                                }
                            </View>
                            <Button
                                buttonStyle={styles.buttonCreatePost}
                                title="Đăng bài"
                                onPress={() => {
                                    onSubmit();
                                }}
                            >
                            </Button>
                        </>
                    }>
                </FlatList>
            </ImageBackground>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,

        paddingBottom: 30,
        backgroundColor: 'rgba(2, 156, 89, 1)',
    },
    body: {
        marginTop: 5,
        backgroundColor: 'rgba(2, 156, 89, 0.6)',
        flex: 1,
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 30,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
    },
    titleIttem: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        paddingBottom: 5,
        paddingLeft: 3,
    },
    input: {
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#f0f2f1',
        marginHorizontal: 3,

    },
    textArea: {
        borderWidth: 1,
        borderColor: themes.colors.main,
        borderRadius: 10,
        marginBottom: 15,
        marginHorizontal: 3,
        paddingHorizontal: 20,
        backgroundColor: '#f0f2f1',
    },
    textInputFocus: {
        borderColor: 'red',
    },
    textInput: {
        borderColor: '#f0f2f1',
    },
    dropdownCategory: {
        backgroundColor: '#f0f2f1',
        borderRadius: 10,
        width: 200,
        height: 40,
        justifyContent: 'center'
    },
    pickerCategory: {
        height: 50,
        width: 200,
        color: '#000'
    
    },
    styledButtonSignUp: {
        backgroundColor: '#fff',
    },
    buttonAddRow: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 25,
        marginTop: -10,

    },
    buttonTitleAddRow: {
        // color: '#faf607',
        color: '#8fffce',
        textDecorationLine: 'underline',
        fontSize: 18,
        fontWeight: '600',
    },
    ingredientInputGroup: {
        flex: 1,
        backgroundColor: '#bbf2da',
        paddingVertical: 10,
        paddingTop: 16,
        marginBottom: 14,
        marginHorizontal: 3,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: themes.colors.main,
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: -5,
        marginRight: 10,
    },
    flexColumn: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ingredientNameInput: {
        width: '85%',
    },
    ingredientAmountInput: {
        width: '50%',
        marginLeft: 10,
    },

    deleteButton: {
        position: 'absolute',
        top: -23,
        right: -7,
    },
    deleteButtonStep: {
        position: 'absolute',
        top: -20,
        right: -3,
    },
    stepInputGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepNameInput: {
        flex: 1,
    },
    iconDelete: {
        color: themes.colors.main,
        marginTop: 10,
        opacity: 0.9,
        backgroundColor: '#f0f2f1',
        borderColor: themes.colors.main,
        borderWidth: 1,
        fontSize: 30,
        borderRadius: 100,
        width: 30,
        height: 30,
    },
    iconDelete2: {
        color: themes.colors.main,
        display: 'none',
    },

    buttonCreatePost: {
        backgroundColor: '#d6b704',
        alignItems: 'center',
        marginHorizontal: 90,
        borderRadius: 20,
    },
    errorMsg: {
        color: '#faf607',
        fontSize: 14,
        paddingLeft: 10,
        marginTop: -10,
        marginBottom: 10,
        fontWeight: '600',
        fontStyle: 'italic'
    },
    errorMsgIngredient: {
        color: '#d90000',
        fontSize: 14,
        paddingLeft: 10,
        marginTop: -10,
        marginBottom: 10,
        fontStyle: 'italic'

    },
    borderInputError: {
        borderWidth: 2.5,
        borderColor: '#edc824',
    },
    borderInputErrIngredient: {
        borderWidth: 1,
        borderColor: '#d90000',
    },
});

export default CreateRecipeScreen;
