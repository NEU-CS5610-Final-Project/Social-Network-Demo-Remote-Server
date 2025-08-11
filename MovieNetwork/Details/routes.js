import axios from "axios";
import * as likedDao from "../Liked/dao.js";
import * as reviewDao from "../Reviews/dao.js";
import * as movieVoteDao from "../MovieVote/dao.js";
import * as reviewVoteDao from "../ReviewVote/dao.js";



// At the end of the day, the Details page should display:
// 1. TMDB movie details
// 2. Whether the current user liked the movie
// 3. Average rating & rating count from local DB
// 4. List of reviews with vote counts
// You can use the example.json file to see the expected output.

export default function DetailsRoutes(app) {
  // GET /api/details/:did
  app.get("/api/details/:did", async (req, res) => {
    const did = String(req.params.did); // TMDB movie id
    const uid = req.session?.currentUser?._id; // user id

    // 1. call your own TMDB details API
    // already done in TMDB/routes.js
    const tmdbP = axios.get(`${process.env.NODE_SERVER_DOMAIN}/api/tmdb/details/${did}`, {
      params: { lang: "en-US" }
    });

    // 2. check local liked status && multiple concurrent requests
    // if user is not logged in, set liked to false
    // if user is logged in, check if the movie is liked
    const likedP   = uid ? likedDao.find(uid, did) : Promise.resolve(null);
    const reviewsP = reviewDao.findReviewsByMovie(did);
    const countP   = movieVoteDao.getMovieVoteCount(did);
    const avgAggP  = movieVoteDao.getMovieVoteAverage(did);

    const [tmdbResp, likedDoc, reviews, ratingCount, ratingAgg] =
      await Promise.all([tmdbP, likedP, reviewsP, countP, avgAggP]);

    // 3. check local rating
    // if there are no ratings, set rating to null
    // if there are ratings, set rating to the average rating
    const ratingAvg = Array.isArray(ratingAgg) && ratingAgg.length
      ? ratingAgg[0].averageRating
      : null;

    // 4. add voteCount to each review
    // based on your existing single query DAO
    const ids = reviews.map(r => r._id);
    const voteCounts = await Promise.all(ids.map(id => reviewVoteDao.getReviewVoteCount(id)));
    const reviewsWithVotes = reviews.map((r, i) => ({
      _id: r._id,
      user_id: r.user_id,
      movie_id: r.movie_id,
      content: r.content,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      votes: voteCounts[i] ?? 0,
    }));

    // 5. return aggregated data
    res.json({
      ...tmdbResp.data,
      local: {
        liked: !!likedDoc,
        rating: { avg: ratingAvg, count: ratingCount },
        reviews: reviewsWithVotes
      }
    });
  });
}
