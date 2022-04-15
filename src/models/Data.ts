/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import * as mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
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

})

export default mongoose.model("Data", DataSchema);