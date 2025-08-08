import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("LikedModel", schema);
export default model;
