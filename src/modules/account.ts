/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import {Express} from "express";
import * as mongoose from "mongoose";
import * as globals from "../globals";
import UserSchema from "../models/User";
import * as crypto from "crypto";

export default function (app: Express) {

    app.post(`${globals.route_start}/account/create`, async (req, res) => {

        if(!req.body || !req.body.username || !req.body.password || !req.body.email) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {

            if(await UserSchema.find({ name: req.body.username }).countDocuments() > 0) {
                res.status(400).json({
                    error: "Username already exists"
                })
                return;
            }

            const user = await UserSchema.create({
                name: req.body.username,
                password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
                email: req.body.email,
                active: false
            });

            await user.save();

            console.log(`Created user ${user.name} with id ${user._id}`);

            res.status(200).json({
                success: true,
                user: user
            });

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })
}