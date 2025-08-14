import * as dao from "./dao.js";

export default function FollowRoutes(app) {
    // Follow a user
    const followUser = async (req, res) => {
        const { uid } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        await dao.followUser(uid, currentUser._id);
        res.sendStatus(200);
    };
    app.post("/api/follow/:uid", followUser);

    // Unfollow a user
    const unfollowUser = async (req, res) => {
        const { uid } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        await dao.unfollowUser(uid, currentUser._id);
        res.sendStatus(200);
    };
    app.delete("/api/follow/:uid", unfollowUser);

    // Delete a follower
    const deleteFollower = async (req, res) => {
        const { uid } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        await dao.deleteFollower(uid, currentUser._id);
        res.sendStatus(200);
    };
    app.delete("/api/follow/:uid/follower", deleteFollower);
}