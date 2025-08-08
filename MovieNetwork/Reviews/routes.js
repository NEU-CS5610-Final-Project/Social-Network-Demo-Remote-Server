import * as dao from "./dao.js";

export default function ReviewRoutes(app) {
    // Post a new review
    app.post("/api/reviews", async (req, res) => {
        const reviewData = req.body;
        const newReview = await dao.createReview(reviewData);
        res.status(200).json(newReview);
    });

    // Delete a review
    app.delete("/api/reviews/:rid", async (req, res) => {
        const { rid } = req.params;
        await dao.deleteReview(rid);
        res.sendStatus(200);
    });

    // Update a review
    app.put("/api/reviews/:rid", async (req, res) => {
        const { rid } = req.params;
        const reviewData = req.body;
        await dao.updateReview(rid, reviewData);
        res.sendStatus(200);
    });

    // Get reviews by movie ID
    app.get("/api/reviews/movie/:movieId", async (req, res) => {
        const { movieId } = req.params;
        const reviews = await dao.findReviewsByMovie(movieId);
        res.json(reviews);
    });
};