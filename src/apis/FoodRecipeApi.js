import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
const shortid = require('shortid');

import { COLLECTION_NAME } from '../global/constants';

const uploadImage = async (recipeId, ingredient) => {
    if (!ingredient.uri) {
        delete ingredient['uri'];

        return {
            ...ingredient,
            image: null,
        };
    } else {
        const uri = ingredient.uri;

        const fileExtension = uri.split('.').pop();

        const id = shortid.generate();

        const fileName = `${id}.${fileExtension}`;

        const storageRef = storage().ref(`recipes/${recipeId}/${fileName}`);
        await storageRef.putFile(uri);

        const downloadURL = await storageRef.getDownloadURL();
        delete ingredient['uri'];

        return {
            ...ingredient,
            image: downloadURL
        };
    }
};

const uploadIngredientImages = async (recipeId, ingredients) => {
    return Promise.all(ingredients.map(ingredient => uploadImage(recipeId, ingredient)));
};

const uploadDishImage = async (recipeId, uri) => {
    const fileExtension = uri.split('.').pop();

    const id = shortid.generate();

    const fileName = `${id}.${fileExtension}`;
    const reference = storage().ref(`recipes/${recipeId}/${fileName}`);
    await reference.putFile(uri);

    const downloadURL = await reference.getDownloadURL();

    return downloadURL;

}

export const createRecipe = async (recipe, onCreateRecipeSuccess) => {
    const result = await firestore().collection(COLLECTION_NAME.RECIPES).add(recipe);

    let dishImage;

    const ingredientWithImages = await uploadIngredientImages(result.id, recipe.ingredients);
    if (recipe.image) {
        dishImage = await uploadDishImage(result.id, recipe.image);
    }
    firestore().collection(COLLECTION_NAME.RECIPES).doc(result.id).update({
        ingredients: ingredientWithImages,
        image: dishImage,
    }).then(() => {
        onCreateRecipeSuccess();
    });
}

export const getRecipes = async (onGetRecipesSuccess) => {
    const snapshot = await firestore().collection(COLLECTION_NAME.RECIPES).get();
    onGetRecipesSuccess(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

export const getRecipeById = async (id, onGetRecipeByIdSuccess) => {
    const recipe = await firestore().collection(COLLECTION_NAME.RECIPES).doc(id).get();
    onGetRecipeByIdSuccess(recipe.data());

    // cach khac 
    // firestore().collection(COLLECTION_NAME.RECIPES).doc(id).get()
    // .then((recipe) => {
    //     onGetRecipeByIdSuccess(recipe.data());
    // })
}