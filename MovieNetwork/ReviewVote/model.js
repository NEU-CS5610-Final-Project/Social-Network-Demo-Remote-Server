import mongoose from "mongoose";

const reviewVoteSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    review_id: { type: String, ref: "ReviewModel", required: true },
    count: Number,
},
    { collection: "reviewVotes" }
);

const ReviewVoteModel = mongoose.model("ReviewVoteModel", reviewVoteSchema);
export default ReviewVoteModel;
