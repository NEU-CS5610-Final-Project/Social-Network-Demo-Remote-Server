import model from "./model.js";
import followModel from "../Follows/model.js";
import likedModel from "../Liked/model.js";
import reviewModel from "../Reviews/model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (userData) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newUser = { ...userData, _id: uuidv4(), join_date: todayStr };
    return model.create(newUser);
};

export const findUserByCredentials = (username, password) => {
    return model.findOne({ username, password });
};

export const findUserByUsername = (username) => {
    return model.findOne({ username });
};

export const findUserById = (id) => {
    return model.findById(id);
};

export const updateUser = (userID, user) => model.updateOne({ _id: userID }, { $set: user });

export const deleteUser = (userID) => model.deleteOne({ _id: userID });

export const findFollowList = (userID) => {
    return followModel
        .find({ follower_id: userID })
        .populate({
            path: "followed_id",
            select: "username avatar",
            model: "UserModel"
        });
};

export const findFollowerList = (userID) => {
    return followModel
        .find({ followed_id: userID })
        .populate({
            path: "follower_id",
            select: "username avatar",
            model: "UserModel"
        });
};

export const findLikedMovies = (userID) => {
    return likedModel.find({ user_id: userID }).populate("movie_id");
};

export const findUserReviews = (userID) => {
    return reviewModel.find({ user_id: userID });
};

export const getVotedMovies = async (userID) => {
    const userVote = await model.findById(userID).select("voted_movie");
    if (!userVote) return null;
    return {
        _id: userVote._id,
        voted_movie: userVote.voted_movie || []
    };
};

export const getVotedReviews = async (userID) => {
    const userVote = await model.findById(userID).select("voted_review");
    if (!userVote) return null;
    return {
        _id: userVote._id,
        voted_review: userVote.voted_review || []
    };
};
