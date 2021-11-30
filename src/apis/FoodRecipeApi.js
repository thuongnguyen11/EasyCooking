import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
const shortid = require('shortid');
import auth from '@react-native-firebase/auth';

import { COLLECTION_NAME, RECIPE_STATUS } from '../global/constants';
import { getKeywords } from '../global/utilities';


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
    const user = auth().currentUser;
    const keywords = getKeywords(recipe.name);
    const newRecipe = { ...recipe, status: RECIPE_STATUS.PENDING, keywords, uid: user.uid }
    const result = await firestore().collection(COLLECTION_NAME.RECIPES).add(newRecipe);

    let dishImage;

    const ingredientWithImages = await uploadIngredientImages(result.id, recipe.ingredients);
    if (recipe.image) {
        dishImage = await uploadDishImage(result.id, recipe.image);
    }
    firestore().collection(COLLECTION_NAME.RECIPES).doc(result.id).update({
        ingredients: ingredientWithImages,
        image: dishImage,
        createdAt: firestore.FieldValue.serverTimestamp(),
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

export const searchRecipe = async (recipeName, onSearchRecipeSuccess) => {
    const snapshot = await firestore().collection(COLLECTION_NAME.RECIPES)
        .where('keywords', 'array-contains', recipeName)
        .get();
    onSearchRecipeSuccess(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

export const updateFavoritesList = async (favorites, onUpdateFavoritesSuccess) => {
    const user = auth().currentUser;
    await firestore().collection(COLLECTION_NAME.USERS).doc(user.uid).update({
        favorites: favorites,
    });

    onUpdateFavoritesSuccess();
}

export const getUserInformation = async (onGetUserInforSuccess) => {
    const user = auth().currentUser;
    const userInfor = await firestore().collection(COLLECTION_NAME.USERS).doc(user.uid).get();
    onGetUserInforSuccess({ ...userInfor.data(), email: user.email });
}

export const updateUserInfor = async (userInfor, onUpdateUserInforSuccess) => {
    const user = auth().currentUser;

    const { favorites, type, email, ...cloned } = userInfor;

    await firestore().collection(COLLECTION_NAME.USERS).doc(user.uid).update({ ...cloned });

    onUpdateUserInforSuccess();
}

export const getRecipesFavorite = async (ids, onGetRecipesFavoriteSuccess) => {
    let recipesFavorite = [];

    const result = await Promise.all(ids.map(id => firestore().collection(COLLECTION_NAME.RECIPES).doc(id).get()));
    recipesFavorite = result.map(r => ({ id: r.id, ...r.data() }));

    onGetRecipesFavoriteSuccess(recipesFavorite);
}


export const getMyRecipes = async (onGetMyRecipesSuccess) => {
    const user = auth().currentUser;
    const snapshot = await firestore().collection(COLLECTION_NAME.RECIPES).where('uid', '==', user.uid).get();
    const myRecipes = snapshot.docs.map(d => ({ ...d.data(), id: d.id, }));
    
    onGetMyRecipesSuccess(myRecipes);
}