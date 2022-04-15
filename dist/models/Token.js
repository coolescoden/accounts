"use strict";
/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var TokenSchema = new mongoose.Schema({
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
        default: function () { return new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 30); },
        expires: 180,
        required: true
    },
    permissions: {
        type: [String],
        required: true,
    }
});
exports.default = mongoose.model("Token", TokenSchema);
//# sourceMappingURL=Token.js.map