import * as dao from "./dao.js";
import * as userDao from "../Users/dao.js";
import { v4 as uuidv4 } from "uuid";

export default function MovieVoteRoutes(app) {
    // Create a new movie vote
    app.post("/api/movievotes/:movieID", async (req, res) => {
        const { movieID } = req.params;
        const userID = req.session["currentUser"]?._id;
        const votedMovies = await userDao.getVotedMovies(userID);
        if (votedMovies.voted_movie.some(vote => vote.movie_id === movieID)) {
            return res.status(400).send("User has already voted for this movie");
        }
        if (!userID) {
            return res.status(401).send("User not authenticated");
        }
        await userDao.updateUser(userID, { voted_movie: [...votedMovies.voted_movie, { movie_id: movieID }] });
        const voteData = { ...req.body, movie_id: movieID, user_id: userID, _id: uuidv4() };
        const newVote = await dao.createMovieVote(voteData);
        res.status(200).json(newVote);
    });

    // Update a movie vote (not used by now)
    app.put("/api/movievotes/:mvid", async (req, res) => {
        const { mvid } = req.params;
        const voteData = req.body;
        await dao.updateMovieVote(mvid, voteData);
        res.sendStatus(200);
    });

    // Remove a movie vote
    app.delete("/api/movievotes/:movieID", async (req, res) => {
        const { movieID } = req.params;
        const userID = req.session["currentUser"]?._id;
        const votedMovies = await userDao.getVotedMovies(userID);
        if (!votedMovies.voted_movie.some(vote => vote.movie_id === movieID)) {
            return res.status(400).send("User has not voted for this movie");
        }
        if (!userID) {
            return res.status(401).send("User not authenticated");
        }
        await userDao.updateUser(userID, { voted_movie: votedMovies.voted_movie.filter(vote => vote.movie_id !== movieID) });
        await dao.removeMovieVote(movieID, userID);
        res.sendStatus(200);
    });

    // Get vote count for a movie
    app.get("/api/movievotes/:movieID/count", async (req, res) => {
        const { movieID } = req.params;
        const count = await dao.getMovieVoteCount(movieID);
        res.json({ count });
    });

    // Get average rating for a movie
    app.get("/api/movievotes/:movieID/average", async (req, res) => {
        const { movieID } = req.params;
        const average = await dao.getMovieVoteAverage(movieID);
        res.json(average);
    });

    // Get current user's vote for a movie
    app.get("/api/movievotes/:movieID/currentUser", async (req, res) => {
        const { movieID } = req.params;
        const userId = req.session["currentUser"]._id;
        const userVote = await dao.getUserMovieVotes(movieID, userId);
        res.json(userVote);
    });
}