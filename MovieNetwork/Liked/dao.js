import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// idempotent "like": don't insert if already exists
export const addLikedMovie = (userID, movieID) => {
  return model.updateOne(
    { user_id: userID, movie_id: movieID }, // find condition
    { $setOnInsert: { _id: uuidv4(), user_id: userID, movie_id: movieID } },
    { upsert: true }
  );
};

// correct deletion: by user_id + movie_id; don't bring new random _id
export const removeLikedMovie = (userID, movieID) => {
  return model.deleteOne({ user_id: userID, movie_id: movieID });
};

// for details to check if already liked
export const find = (userID, movieID) => {
  return model.findOne({ user_id: userID, movie_id: movieID });
};