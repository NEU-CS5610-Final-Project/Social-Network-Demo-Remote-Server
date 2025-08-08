import * as dao from "./dao.js";

export default function MovieVoteRoutes(app) {
    // Create a new movie vote
    app.post("/api/movievotes/:movieID", async (req, res) => {
        const { movieID } = req.params;
        const voteData = { ...req.body, movie_id: movieID };
        const newVote = await dao.createMovieVote(voteData);
        res.status(200).json(newVote);
    });

    // Update a movie vote
    app.put("/api/movievotes/:mvid", async (req, res) => {
        const { mvid } = req.params;
        const voteData = req.body;
        await dao.updateMovieVote(mvid, voteData);
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
}