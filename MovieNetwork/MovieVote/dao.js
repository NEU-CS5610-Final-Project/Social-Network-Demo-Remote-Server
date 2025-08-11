import model from "./model.js";

export const createMovieVote = (vote) => model.create(vote);

export const updateMovieVote = (id, vote) => model.updateOne({ _id: id }, { $set: vote });

export const getMovieVoteCount = (movieId) => model.countDocuments({ movie_id: movieId });

export const getMovieVoteAverage = (movieId) =>
    model.aggregate([
      { $match: { movie_id: movieId } },
      { $group: { _id: "$movie_id", averageRating: { $avg: "$rating" } } }
    ]);