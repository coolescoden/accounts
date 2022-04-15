"use strict";
/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var DataSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    data: {
        type: Object || String,
        required: true,
    },
    access: {
        required: true,
        type: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                permissions: [String]
            }]
    }
});
exports.default = mongoose.model("Data", DataSchema);
//# sourceMappingURL=Data.js.map