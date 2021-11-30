import React, { useState, useEffect } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const UploadImage = ({ dishImage, onDishImagePicked }) => {

    const [selectedImage, setSelectedImage] = useState();

    useEffect(() => {
        setSelectedImage(dishImage);
    }, [dishImage])

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
                    onDishImagePicked(response.assets[0].uri);
                }
            }
        )
    }

    return (
        <TouchableOpacity style={styles.container}
            onPress={pickImageHandler}>
            <View style={[styles.imageContainer, selectedImage ? null : styles.dashed]}>
                <Text style={styles.titleImage}>Tải ảnh lên</Text>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    imageContainer: {
        marginVertical: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#fff',
        flex: 1,
        width: '100%',
        height: 200,
        color: '#fff',
        backgroundColor: 'rgba(240, 242, 241,1)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    dashed: {
        borderStyle: 'dashed'
    },
    titleImage: {
        color: '#939695',
        fontSize: 18,
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

export default UploadImage;