import model from "./model.js";

export const addReviewVote = async (reviewID) => {
    const result = await model.findOneAndUpdate(
        { review_id: reviewID },
        { $inc: { count: 1 } },
        { new: true }
    );
    if (!result) {
        return null;
    }
    return result;
}

export const removeReviewVote = async (reviewID) => {
    const result = await model.findOneAndUpdate(
        { review_id: reviewID },
        { $inc: { count: -1 } },
        { new: true }
    );
    if (!result) {
        return null;
    }
    return result;
};

export const getReviewVoteCount = async (reviewID) => {
    const result = await model.findOne({ review_id: reviewID });
    if (!result) {
        return 0;
    }
    return result.count;
};
