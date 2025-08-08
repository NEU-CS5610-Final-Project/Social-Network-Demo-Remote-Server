import * as dao from "./dao.js";
import followModel from "../Follows/model.js";

export default function UserRoutes(app) {
    //Sign In
    const signIn = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            const currentUserObj = currentUser.toObject ? currentUser.toObject() : { ...currentUser };
            delete currentUserObj.password;
            req.session["currentUser"] = currentUserObj;
            res.json(currentUserObj);
        } else {
            res.status(401).json({ message: "Incorrect username or password" });
        }
    };
    app.post("/api/users/signin", signIn);

    //Sign Up
    const signUp = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    app.post("/api/users/signup", signUp);

    // Sign Out
    const signOut = (req, res) => {
        req.session["currentUser"] = null;
        res.sendStatus(200);
    };
    app.post("/api/users/signout", signOut);

    //Profile
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    app.post("/api/users/profile", profile);
    const findProfile = async (req, res) => {
        const uid = req.params.uid;
        const currentUser = req.session["currentUser"];
        const user = await dao.findUserById(uid);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        let isSelf = false;
        let isFollowing = false;
        if (currentUser) {
            isSelf = currentUser._id === user._id;
        }
        const likedMovies = await dao.findLikedMovies(uid);
        const userReviews = await dao.findUserReviews(uid);
        const followers = await followModel
            .find({ followed_id: uid })
            .populate({
                path: 'follower_id',
                select: '_id avatar'
            })
            .lean();
        const following = await followModel
            .find({ follower_id: uid })
            .populate({
                path: 'followed_id',
                select: '_id avatar'
            })
            .lean();
        const followerList = followers.map(f => ({
            _id: f.follower_id._id,
            avatar: f.follower_id.avatar
        }));
        const followingList = following.map(f => ({
            _id: f.followed_id._id,
            avatar: f.followed_id.avatar
        }));
        if (isSelf) {
            const fullUser = { ...user._doc || user };
            delete fullUser.password;
            fullUser.followers = followerList;
            fullUser.following = followingList;
            fullUser.liked = likedMovies.map(l => l.movie_id);
            fullUser.reviews = userReviews.map(r => ({
                content: r.content,
                movie_id: r.movie_id
            }));
            res.json(fullUser);
        } else {
            const filteredUser = { ...user._doc || user };
            if (currentUser) {
                isFollowing = await followModel.exists({
                    follower_id: user._id,
                    followed_id: currentUser._id
                });
            }
            for (const [key, privacySetting] of Object.entries(filteredUser.privacy || {})) {
                if ((privacySetting === 1 && !isFollowing) || privacySetting === 2) {
                    delete filteredUser[key];
                }
            }
            if ((filteredUser.privacy.following === 1 && isFollowing) || filteredUser.privacy.following === 0) {
                filteredUser.following = followingList;
            }
            if ((filteredUser.privacy.liked === 1 && isFollowing) || filteredUser.privacy.following === 0) {
                filteredUser.liked = likedMovies.map(l => l.movie_id);
            }
            if ((filteredUser.privacy.review === 1 && isFollowing) || filteredUser.privacy.review === 0) {
                filteredUser.reviews = userReviews.map(r => ({
                    content: r.content,
                    movie_id: r.movie_id
                }));
            }
            filteredUser.followers = followerList;
            delete filteredUser.password;
            delete filteredUser.privacy;
            res.json(filteredUser);
        }
    };
    app.get("/api/users/profile/:uid", findProfile);

    //Update
    const updateUser = async (req, res) => {
        const { uid } = req.params;
        const userUpdates = req.body;
        await dao.updateUser(uid, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === uid) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
    };
    app.put("/api/users/:uid", updateUser);
    const updateUserPassword = async (req, res) => {
        const { uid } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = await dao.findUserById(uid);
        if (!user || user.password !== oldPassword) {
            res.status(400).json(
                { message: "Wrong old password" });
            return;
        }
        await dao.updateUser(uid, { password: newPassword });
        res.sendStatus(200);
    };
    app.put("/api/users/:uid/password", updateUserPassword);

    //Delete User
    const deleteUser = async (req, res) => {
        const { uid } = req.params;
        await dao.deleteUser(uid);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === uid) {
            req.session["currentUser"] = null;
        }
        res.sendStatus(200);
    };
    app.delete("/api/users/:uid", deleteUser);

    // Get Follow List
    const getFollowList = async (req, res) => {
        const { uid } = req.params;
        const followList = await dao.findFollowList(uid);
        res.json(followList);
    };
    app.get("/api/users/:uid/following", getFollowList);

    // Get Follower List
    const getFollowerList = async (req, res) => {
        const userId = req.params.uid;
        const followerList = await dao.findFollowerList(userId);
        res.json(followerList);
    };
    app.get("/api/users/:uid/followers", getFollowerList);

    //Get Liked Movies
    const getLikedMovies = async (req, res) => {
        const { uid } = req.params;
        const likedMovies = await dao.findLikedMovies(uid);
        res.json(likedMovies);
    };
    app.get("/api/users/:uid/liked", getLikedMovies);

    //Get User Reviews
    const getUserReviews = async (req, res) => {
        const { uid } = req.params;
        const userReviews = await dao.findUserReviews(uid);
        res.json(userReviews);
    };
    app.get("/api/users/:uid/reviews", getUserReviews);
};