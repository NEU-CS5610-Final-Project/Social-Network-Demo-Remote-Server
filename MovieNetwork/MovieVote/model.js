import mongoose from "mongoose";

const movieVoteSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    movie_id: { type: String, required: true },
    rating: { type: Number, required: true }
},
    { collection: "movieVotes" }
);

const MovieVote = mongoose.model("MovieVoteModel", movieVoteSchema);

export default MovieVote;
