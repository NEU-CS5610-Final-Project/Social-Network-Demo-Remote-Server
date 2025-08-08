import * as dao from "./dao.js";

export default function LikedRoutes(app) {
    // Add a liked movie
    app.post("/api/liked/:mid", async (req, res) => {
        const { mid } = req.params;
        const uid = req.session["currentUser"]?._id;
        if (!uid) {
            res.sendStatus(401);
            return;
        }
        await dao.addLikedMovie(uid, mid);
        res.sendStatus(200);
    });

    // Remove a liked movie
    app.delete("/api/liked/:mid", async (req, res) => {
        const { mid } = req.params;
        const uid = req.session["currentUser"]?._id;
        if (!uid) {
            res.sendStatus(401);
            return;
        }
        await dao.removeLikedMovie(uid, mid);
        res.sendStatus(200);
    });
}