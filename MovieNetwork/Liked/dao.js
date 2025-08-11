import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const addLikedMovie = (userID, movieID) => {
    const likedMovie = new model({ user_id: userID, movie_id: movieID, _id: uuidv4() });
    return likedMovie.save();
};

export const removeLikedMovie = (userID, movieID) => {
    return model.deleteOne({ user_id: userID, movie_id: movieID, _id: uuidv4() });
};