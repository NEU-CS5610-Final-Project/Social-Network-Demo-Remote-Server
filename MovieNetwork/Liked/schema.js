import mongoose from "mongoose";

const likedSchema = new mongoose.Schema({
    _id: String,
    user_id: { type: String, ref: "UserModel" },
    movie_id: String,
},
    { collection: "liked" }
);
export default likedSchema;