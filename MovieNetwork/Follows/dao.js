import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const followUser = (userID, currentUserID) => {
    const follow = {
        _id: uuidv4(),
        follower_id: currentUserID,
        followed_id: userID
    };
    return model.create(follow);
};

export const unfollowUser = (userID, currentUserID) => {
    return model.deleteOne({ follower_id: currentUserID, followed_id: userID });
};

// Get all user IDs that the current user follows
export const findFollowedIds = async (followerId) => {
    const rows = await model.find({ follower_id: followerId })
      .select("followed_id")
      .lean();
    return rows.map(r => String(r.followed_id));
  };