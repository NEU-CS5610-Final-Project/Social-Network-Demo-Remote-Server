import mongoose from "mongoose";

const likedSchema = new mongoose.Schema(
  {
    _id: String, // using uuid for primary key
    user_id: { type: String, ref: "UserModel", required: true, index: true },
    movie_id: { type: String, required: true, index: true }, // using string for movie id
  },
  { collection: "liked", timestamps: true }
);

// only one record for each user and movie (to prevent duplicates)
// new add here
likedSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

export default likedSchema;