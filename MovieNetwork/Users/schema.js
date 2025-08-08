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
    }
},
    { collection: 'users' }
);
export default userSchema;
