import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    email: String,
    password: String,
    bio: String,
    join_date: String,
    avatar: String,
    role: String,
    privacy: {
        email: Number,
        bio: Number,
        join_date: Number,
        liked: Number,
        following: Number,
        review: Number
    },
    voted_movie: [
        {
            movie_id: { type: String, required: true }
        }
    ],
    voted_review: [
        {
            review_id: { type: String, required: true }
        }
    ]
},
    { collection: 'users' }
);
export default userSchema;
