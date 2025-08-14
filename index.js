import session from "express-session";
import "dotenv/config";
import mongoose from "mongoose";
import express from 'express'
import cors from "cors";

import UserRoutes from "./MovieNetwork/Users/routes.js";
import FollowRoutes from "./MovieNetwork/Follows/routes.js";
import LikedRoutes from "./MovieNetwork/Liked/routes.js";
import ReviewRoutes from "./MovieNetwork/Reviews/routes.js";
import MovieVoteRoutes from "./MovieNetwork/MovieVote/routes.js";
import ReviewVoteRoutes from "./MovieNetwork/ReviewVote/routes.js";
// TMDB routes
import TMDBRoutes from "./MovieNetwork/TMDB/routes.js";
// Details routes
import DetailsRoutes from "./MovieNetwork/Details/routes.js";
import FollowedReviewsRoutes from "./MovieNetwork/FollowedReviews/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/movie-network";
mongoose.connect(CONNECTION_STRING);
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
}));
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "movie-network",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
FollowRoutes(app);
LikedRoutes(app);
ReviewRoutes(app);
MovieVoteRoutes(app);
ReviewVoteRoutes(app);
FollowedReviewsRoutes(app);
TMDBRoutes(app);
DetailsRoutes(app);

app.listen(process.env.PORT || 4000);