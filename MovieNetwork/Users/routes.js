import * as dao from "./dao.js";

export default function UseRoutes(app) {
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
            res.status(401).json({ message: "Unable to login. Try again later." });
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
        if (currentUser) {
            isSelf = currentUser._id === user._id;
        }
        if (isSelf) {
            const fullUser = { ...user._doc || user };
            delete fullUser.password;
            delete fullUser.__v;
            res.json(fullUser);
        } else {
            const filteredUser = { ...user._doc || user };
            for (const [key, privacySetting] of Object.entries(filteredUser.privacy || {})) {
                //TODO: add only followers logic
                if (privacySetting === 1 || privacySetting === 2) {
                    delete filteredUser[key];
                }
            }
            delete filteredUser.password;
            delete filteredUser.privacy;
            delete filteredUser.__v;
            res.json(filteredUser);
        }
    };
    app.get("/api/users/profile/:uid", findProfile);
};