"use strict";
/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
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
        default: function () { return new Date(); },
        immutable: true,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: function () { return new Date(); },
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
    deletionToken: {
        type: String,
        required: false,
    },
});
exports.default = mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map