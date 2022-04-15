/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import * as mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 30),
        expires: 180,
        required: true
    },
    permissions: {
        type: [String],
        required: true,
    }
})

export default mongoose.model("Token", TokenSchema);