import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (userData) => {
    const newUser = { ...userData, _id: uuidv4() };
    return model.create(newUser);
};

export const findUserByCredentials = (username, password) => {
    return model.findOne({ username, password });
};

export const findUserByUsername = (username) => {
    return model.findOne({ username });
};

export const findUserById = (id) => {
    return model.findById(id);
};