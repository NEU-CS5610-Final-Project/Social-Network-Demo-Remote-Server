import * as dao from "./dao.js";
import * as userDao from "../Users/dao.js";

export default function ReviewVoteRoutes(app) {
    // Add a vote to a review
    app.put("/api/reviewvote/:rvid", async (req, res) => {
        const reviewID = req.params.rvid;
        const votedReviews = await userDao.getVotedReviews(req.session["currentUser"]._id);
        if (votedReviews.voted_review.some(vote => vote.review_id === reviewID)) {
            return res.status(400).send("User has already voted for this review");
        }
        const result = await dao.addReviewVote(reviewID);
        if (!result) {
            return res.status(404).send("Review not found");
        }
        // Update user's voted reviews
        await userDao.updateUser(req.session["currentUser"]._id, { voted_review: [...votedReviews.voted_review, { review_id: reviewID }] });
        res.send(result);
    });

    // Remove a vote from a review
    app.delete("/api/reviewvote/:rvid", async (req, res) => {
        const reviewID = req.params.rvid;
        const votedReviews = await userDao.getVotedReviews(req.session["currentUser"]._id);
        if (!votedReviews.voted_review.some(vote => vote.review_id === reviewID)) {
            return res.status(400).send("User has not voted for this review");
        }
        const result = await dao.removeReviewVote(reviewID);
        if (!result) {
            return res.status(404).send("Review not found");
        }
        // Update user's voted reviews
        await userDao.updateUser(req.session["currentUser"]._id, { voted_review: votedReviews.voted_review.filter(vote => vote.review_id !== reviewID) });
        res.send(result);
    });

    // Get the vote count for a review
    app.get("/api/reviewvote/:rvid", async (req, res) => {
        const reviewID = req.params.rvid;
        const count = await dao.getReviewVoteCount(reviewID);
        res.send({ count });
    });
}