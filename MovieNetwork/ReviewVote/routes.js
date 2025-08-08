import * as dao from "./dao.js";

export default function ReviewVoteRoutes(app) {
    // Add a vote to a review
    app.put("/api/reviewvote/:rvid", async (req, res) => {
        const reviewID = req.params.rvid;
        const result = await dao.addReviewVote(reviewID);
        if (!result) {
            return res.status(404).send("Review not found");
        }
        res.send(result);
    });

    // Remove a vote from a review
    app.delete("/api/reviewvote/:rvid", async (req, res) => {
        const reviewID = req.params.rvid;
        const result = await dao.removeReviewVote(reviewID);
        if (!result) {
            return res.status(404).send("Review not found");
        }
        res.send(result);
    });

    // Get the vote count for a review
    app.get("/api/reviewvote/:rvid", async (req, res) => {
        const reviewID = req.params.rvid;
        const count = await dao.getReviewVoteCount(reviewID);
        res.send({ count });
    });
}