/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import {Express} from "express";
import * as globals from "../globals";
import UserSchema from "../models/User";
import * as crypto from "crypto";
import {randomString} from "../StringUtil";
import * as nodemailer from "nodemailer";

export default function (app: Express, smtp: { host: string, port: number, secure: boolean, auth: { user: string, pass: string }, displayName: string }) {

    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: smtp.auth
    });

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

            const acToken = req.body.username + "$" + randomString(48)

            const user = await UserSchema.create({
                name: req.body.username,
                password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
                email: req.body.email,
                active: false,
                activationToken: acToken
            });

            await user.save();

            console.log(`Created user ${user.name} with id ${user._id}`);

            const info = await transporter.sendMail({
                from: smtp.displayName + " <" + smtp.auth.user + ">",
                to: user.email,
                subject: "Account activation",
                text: `Hello ${user.name},\n\nPlease click on the following link to activate your account:\n\n${req.protocol + "//" + req.hostname}${globals.route_start}/account/activate/${acToken}\n\nThank you!`,
                html: `<p>Hello ${user.name},</p><p>Please click on the following link to activate your account:</p><p><a href="${req.protocol + "//" + req.hostname}${globals.route_start}/account/activate/${acToken}">${req.protocol + "//" + req.hostname}${globals.route_start}/account/activate/${acToken}</a></p><p>Thank you!</p>`
            })

            console.log("Message sent: %s", info.messageId);

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

    app.get(`${globals.route_start}/account/activate/:token`, (req, res) => {
        if(!req.params || !req.params.token) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        UserSchema.findOne({ activationToken: req.params.token }, (err, user) => {
            if(err) {
                res.status(500).json({
                    error: err.message
                })
                return;
            }

            if(!user) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            user.active = true;
            user.activationToken = "";

            user.save((err) => {
                if(err) {
                    res.status(500).json({
                        error: err.message
                    })
                    return;
                }

                res.status(200).json({
                    success: true,
                    user: user
                })
            })
        })
    })

    app.post(`${globals.route_start}/account/delete`, async (req, res) => {
        if(!req.body || !req.body.username || !req.body.password) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const user = await UserSchema.findOne({ name: req.body.username, password: crypto.createHash("sha256").update(req.body.password).digest("hex") });

            if(!user) {
                res.status(400).json({
                    error: "Invalid credentials"
                })
                return;
            }

            user.deletionToken = user.name + "$" + randomString(48);
            await user.save();

            const info = await transporter.sendMail({
                from: smtp.displayName + " <" + smtp.auth.user + ">",
                to: user.email,
                subject: "Account deletion",
                text: `Hello ${user.name},\n\nPlease click on the following link to delete your account:\n\n${req.protocol + "//" + req.hostname}${globals.route_start}/account/delete/${user.deletionToken}\n\nThank you!`,
                html: `<p>Hello ${user.name},</p><p>Please click on the following link to delete your account:</p><p><a href="${req.protocol + "//" + req.hostname}${globals.route_start}/account/delete/${user.deletionToken}">${req.protocol + "//" + req.hostname}${globals.route_start}/account/delete/${user.activationToken}</a></p><p>Thank you!</p>`
            })

            console.log("Message sent: %s", info.messageId);


            res.status(200).json({
                success: true,
                message: "An email has been sent to you to confirm the deletion of your account"
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.get(`${globals.route_start}/account/delete/:token`, async (req, res) => {
        if(!req.params || !req.params.token) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const user = await UserSchema.findOne({ deletionToken: req.params.token });

            if(!user) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            await user.remove();

            res.status(200).json({
                success: true,
                message: "Your account has been deleted"
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

}