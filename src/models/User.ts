/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true,
    },
    activationToken: {
        type: String,
        required: false,
    },
})

export default mongoose.model("User", UserSchema);