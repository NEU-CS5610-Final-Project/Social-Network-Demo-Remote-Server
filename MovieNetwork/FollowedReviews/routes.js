import * as followDao from "../Follows/dao.js";
import * as reviewDao from "../Reviews/dao.js";
import * as userDao from "../Users/dao.js";


export default function FollowedReviewsRoutes(app) {
  app.get("/api/feed/following-reviews", async (req, res) => {
    try {
      const uid = req.session?.currentUser?._id;
      if (!uid) return res.status(401).json({ error: "Not logged in" });
  
      const limit = Math.min(Number(req.query.limit) || 5, 20);
  
      const followedIds = await followDao.findFollowedIds(uid);
  
      if (!Array.isArray(followedIds) || followedIds.length === 0) {
        return res.json({ reviews: [] });
      }
  
      const reviews = await reviewDao.findRecentByUsers(followedIds, limit);
  
      const authorIds = [...new Set((reviews || []).map(r => String(r.user_id)))];
  
      const authorMap = await userDao.findBasicByIdsAsMap(authorIds);
  
      const payload = (reviews || []).map(r => ({
        _id: r._id,
        content: r.content,
        movie_id: r.movie_id,
        update_time: r.update_time,
        author: authorMap?.get(String(r.user_id)) || { _id: r.user_id, username: "Unknown" }
      }));
      res.json({ reviews: payload });
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err?.message });
    }
  });
};