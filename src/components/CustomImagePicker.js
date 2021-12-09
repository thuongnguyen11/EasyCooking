import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    ImageBackground
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import themes from '../config/themes';


const CustomImagePicker = ({ image, onImagePicked }) => {

    const [selectedImage, setSelectedImage] = useState();

    useEffect(() => {
        if (image) {
            setSelectedImage(image);
        }
    }, [image])

    const pickImageHandler = () => {
        launchImageLibrary({ title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
            response => {
                if (response.errorCode) {
                    console.log("image error");
                }
                else if (response.didCancel) {
                    console.log("cancel");
                } else {
                    setSelectedImage(response.assets[0].uri);
                    onImagePicked(response.assets[0].uri);
                }
            }
        )
    }

    return (
        <TouchableOpacity style={styles.container}
            onPress={pickImageHandler}>
            <View style={styles.imageContainer}>
                <Text style={styles.titleImage}>Ảnh nguyên liệu</Text>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '50%',
        alignItems: 'center'
    },
    imageContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: themes.colors.main,
        borderStyle: 'dashed',
        width: 100,
        height: 100,
        color: '#fff',
        backgroundColor: '#f0f2f1',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'

    },
    titleImage: {
        textAlign: 'center',
        color: '#939695',
        paddingHorizontal: 12,

    },
    button: {
        margin: 8
    },
    previewImage: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
})

export default CustomImagePicker;