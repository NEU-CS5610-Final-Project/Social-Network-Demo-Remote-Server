import model from "./model.js";
import reviewVoteModel from "../ReviewVote/model.js";
import { v4 as uuidv4 } from "uuid";

export const createReview = async (reviewData) => {
    const newReview = { ...reviewData, _id: uuidv4(), update_time: new Date() };
    await model.create(newReview);
    const newReviewVote = { _id: uuidv4(), review_id: newReview._id, count: 0 };
    await reviewVoteModel.create(newReviewVote);
    return newReview;
};

export const deleteReview = async (reviewID) => {
    await reviewVoteModel.deleteMany({ review_id: reviewID });
    return model.findByIdAndDelete(reviewID);
};

export const updateReview = (reviewID, reviewData) => {
    return model.updateOne({ _id: reviewID }, { $set: reviewData });
};

export const findReviewsByMovie = (movieID) => {
    return model.find({ movie_id: movieID });
};

// Get reviews by user IDs
export const findRecentByUsers = (userIds = [], limit = 5) => {
  if (!Array.isArray(userIds) || userIds.length === 0) return Promise.resolve([]);
  return model
    .find({ user_id: { $in: userIds } })
    .sort({ update_time: -1 })
    .limit(Math.max(1, Math.min(limit, 20)))
    .lean();
};