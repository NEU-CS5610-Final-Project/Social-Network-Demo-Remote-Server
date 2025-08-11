import * as dao from "./dao.js";

export default function LikedRoutes(app) {
  // Add a liked movie
  app.post("/api/liked/:mid", async (req, res) => {
    const { mid } = req.params;
    const uid = req.session?.currentUser?._id;
    if (!uid) return res.sendStatus(401);

    const r = await dao.addLikedMovie(uid, String(mid));
    const created =
      (r.upsertedCount ?? r.nUpserted ?? (Array.isArray(r.upserted) ? r.upserted.length : 0)) > 0;

    res.status(created ? 201 : 200).json({ ok: true, duplicated: !created });
  });

  // Remove a liked movie
  app.delete("/api/liked/:mid", async (req, res) => {
    const { mid } = req.params;
    const uid = req.session?.currentUser?._id;
    if (!uid) return res.sendStatus(401);

    const r = await dao.removeLikedMovie(uid, String(mid));
    if (r.deletedCount > 0) return res.status(200).json({ ok: true });
    res.sendStatus(204);
  });
}