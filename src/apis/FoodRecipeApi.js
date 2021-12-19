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
        totalReviews: 0,
        avgStar: 0,
    }).then(() => {
        onCreateRecipeSuccess();
    });
}

const updateIngredientImage = async (recipeId, ingredient) => {
    if (!ingredient.uri) {
        delete ingredient['uri'];

        return {
            ...ingredient,
            image: null,
        };
    } else if (ingredient.uri.startsWith('https')) {
        const updated = {
            ...ingredient,
            image: ingredient.uri
        }

        delete updated['uri'];

        return updated;
    }
    else {
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

const updateIngredientImages = async (recipeId, ingredients) => {
    return Promise.all(ingredients.map(ingredient => updateIngredientImage(recipeId, ingredient)));
};

export const updateRecipe = async (id, recipe, onUpdateRecipeSuccess) => {
    const keywords = getKeywords(recipe.name);

    let dishImage = null;

    const ingredientWithImages = await updateIngredientImages(id, recipe.ingredients);
    if (recipe.image) {
        dishImage = await uploadDishImage(id, recipe.image);
    }

    const updatedRecipe = {
        ...recipe,
        ingredients: ingredientWithImages,
        status: RECIPE_STATUS.PENDING,
        keywords
    }

    if (!!dishImage) {
        updatedRecipe.image = dishImage;
    }

    firestore().collection(COLLECTION_NAME.RECIPES).doc(id).update(updatedRecipe).then(() => {
        onUpdateRecipeSuccess();
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
        .where('status', '==', RECIPE_STATUS.APPROVED)
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

export const uploadUserAvatar = async (uri, onUploadUserAvtSuccess) => {
    const user = auth().currentUser;
    const fileExtension = uri.split('.').pop();

    const fileName = `avatar.${fileExtension}`;

    const storageRef = storage().ref(`users/${user.uid}/${fileName}`);
    await storageRef.putFile(uri);

    const downloadURL = await storageRef.getDownloadURL();

    firestore().collection(COLLECTION_NAME.USERS).doc(user.uid).update({
        avatar: downloadURL,
    }).then(() => onUploadUserAvtSuccess());

}

export const uploadUserBackground = async (uri, onUploadUserBgSuccess) => {
    const user = auth().currentUser;
    const fileExtension = uri.split('.').pop();

    const fileName = `background.${fileExtension}`;

    const storageRef = storage().ref(`users/${user.uid}/${fileName}`);
    await storageRef.putFile(uri);

    const downloadURL = await storageRef.getDownloadURL();

    firestore().collection(COLLECTION_NAME.USERS).doc(user.uid).update({
        background: downloadURL,
    }).then(() => onUploadUserBgSuccess());

}

export const getRecipesFavorite = async (ids, onGetRecipesFavoriteSuccess) => {
    let recipesFavorite = [];

    const result = await Promise.all(ids.map(id => firestore().collection(COLLECTION_NAME.RECIPES).doc(id).get()));
    recipesFavorite = result.filter(r => !!r.data()).map(r => ({ id: r.id, ...r.data() }));

    onGetRecipesFavoriteSuccess(recipesFavorite);
}

export const getMyRecipes = async (onGetMyRecipesSuccess) => {
    const user = auth().currentUser;
    const snapshot = await firestore().collection(COLLECTION_NAME.RECIPES).where('uid', '==', user.uid).get();
    const myRecipes = snapshot.docs.map(d => ({ ...d.data(), id: d.id, }));

    onGetMyRecipesSuccess(myRecipes);
}

export const getPendingRecipes = async (onGetPendingRecipesSuccess) => {
    const snapshot = await firestore().collection(COLLECTION_NAME.RECIPES)
        .where('status', '==', RECIPE_STATUS.PENDING)
        .get();
    onGetPendingRecipesSuccess(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

export const getApprovedRecipes = async (onGetApprovedRecipesSuccess) => {
    const snapshot = await firestore().collection(COLLECTION_NAME.RECIPES)
        .where('status', '==', RECIPE_STATUS.APPROVED)
        .get();
    onGetApprovedRecipesSuccess(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

export const updateRecipeStatus = async (recipeId, status, ownerId, onUpdateRecipeStatus) => {
    firestore().collection(COLLECTION_NAME.RECIPES).doc(recipeId).update({
        status,
    })
        .then(() => {
            const action = status === RECIPE_STATUS.APPROVED ? 'Phê duyệt' : 'Từ chối'
            const notification = {
                uid: ownerId,
                createdAt: firestore.FieldValue.serverTimestamp(),
                content: `Quản trị viên đã ${action} công thức của bạn.`,
                avatar: '',
            }

            return firestore().collection(COLLECTION_NAME.NOTIFICATIONS).add(notification)
        })
        .then(() => onUpdateRecipeStatus());
}

export const submitReview = async (review, recipe, onSubmitReviewSuccess) => {
    const totalReviews = recipe.totalReviews + 1;
    const avgStar = Math.round((recipe.avgStar + review.star) / totalReviews);

    firestore().collection(COLLECTION_NAME.REVIEWS).add(review)
        .then(() => firestore().collection(COLLECTION_NAME.RECIPES).doc(review.recipeId).update({
            totalReviews,
            avgStar
        }))
        .then(() => {
            const displayName = !!review.name ? review.name : review.uid.substring(0, 6);
            const notification = {
                uid: recipe.uid,
                createdAt: firestore.FieldValue.serverTimestamp(),
                content: `${displayName} đã đánh giá công thức của bạn.`,
                avatar: !!review.avatar ? review.avatar : '',
            }
            return firestore().collection(COLLECTION_NAME.NOTIFICATIONS).add(notification)
        })
        .then(() => onSubmitReviewSuccess());
}

export const getReviewsOfRecipe = async (recipeId, onGetReviewOfRecipeSuccess) => {
    const snapshot = await firestore().collection(COLLECTION_NAME.REVIEWS)
        .where('recipeId', '==', recipeId)
        .get();

    onGetReviewOfRecipeSuccess(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

export const getNotifications = async (onGetNotificationSuccess) => {
    const user = auth().currentUser;
    const snapshot = await firestore().collection(COLLECTION_NAME.NOTIFICATIONS)
        .where('uid', '==', user.uid)
        .get();

    onGetNotificationSuccess(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

export const isRecipeReviewed = async (recipeId, checkIfRecipeReviewed) => {
    const user = auth().currentUser;
    const existed = await firestore().collection(COLLECTION_NAME.REVIEWS)
        .where('uid', '==', user.uid)
        .where('recipeId', '==', recipeId)
        .get();

    checkIfRecipeReviewed(!!existed.docs.length);
}
