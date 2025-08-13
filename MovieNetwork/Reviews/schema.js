import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    _id: String,
    user_id: { type: String, ref: "UserModel" },
    movie_id: String,
    content: { type: String, required: true },
    update_time: Date
},
    { collection: "reviews" }
);

export default reviewSchema;
