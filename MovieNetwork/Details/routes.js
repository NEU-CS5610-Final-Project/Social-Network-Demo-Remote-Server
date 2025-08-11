import axios from "axios";
import * as likedDao from "../Liked/dao.js";
import * as reviewDao from "../Reviews/dao.js";

export default function DetailsRoutes(app) {
  // GET /api/details/:did
  app.get("/api/details/:did", async (req, res) => {
    const did = req.params.did; // TMDB movie id
    const uid = req.session?.currentUser?._id;

    // 1. call your own TMDB details API
    // already done in TMDB/routes.js
    const { data: tmdbData } = await axios.get(
      `${process.env.NODE_SERVER_DOMAIN}/api/tmdb/details/${did}`
    );

    // 2. check local liked status
    // if user is not logged in, set liked to false
    // if user is logged in, check if the movie is liked
    const liked = uid ? !!(await likedDao.find(uid, did)) : false;

    // 3. check local reviews
    const reviews = await reviewDao.findReviewsByMovie(did);

    // 4. return aggregated data
    res.json({ ...tmdbData, liked, reviews });
  });
}