import mongoose from "mongoose";

const schema = new mongoose.Schema({
    _id: String,
    follower_id: { type: String, ref: "UserModel" },
    followed_id: { type: String, ref: "UserModel" },
},
    { collection: 'follows' }
);

export default schema;