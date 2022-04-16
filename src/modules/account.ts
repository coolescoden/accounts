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
import TokenSchema from "../models/Token";
import {hasPermission} from "../Permissions";

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

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
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

    app.post(`${globals.route_start}/account/token/create`, async (req, res) => {
        if(!req.body || !req.body.username && !req.body.password) {
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

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            let permissions = ["ADMIN"];
            let expiresAt = new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 30);

            if(req.body.permissions) {
                permissions = req.body.permissions;
            }

            const token = await TokenSchema.create({
                token: randomString(64),
                userId: user._id,
                permissions: permissions,
                expiresAt: expiresAt
            })

            res.status(200).json({
                success: true,
                token: token.token,
                expiresAt: expiresAt
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.post(`${globals.route_start}/account/token/delete`, async (req, res) => {
        if(!req.body || !req.body.token || !req.body.username || !req.body.password) {
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

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            const token = await TokenSchema.findOne({ token: req.body.token });

            if(!token) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            if(token.userId.toString() !== user._id.toString()) {
                res.status(400).json({
                    error: "Invalid user"
                })
                return;
            }

            await token.remove();

            res.status(200).json({
                success: true,
                message: "Token deleted"
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.post(`${globals.route_start}/account/token/login`, async (req, res) => {
        if(!req.body || !req.body.token) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const token = await TokenSchema.findOne({ token: req.body.token });

            if(!token) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            const user = await UserSchema.findOne({ _id: token.userId });

            if(!user) {
                res.status(400).json({
                    error: "Invalid user"
                })
                return;
            }

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            const x = JSON.parse(JSON.stringify(user));

            if(!hasPermission(token.permissions, "VIEW_PASSWORD")) {
                delete x.password;
            }

            if(!hasPermission(token.permissions, "VIEW_EMAIL")) {
                delete x.email;
            }

            if(!hasPermission(token.permissions, "VIEW_CREATED_AT")) {
                delete x.createdAt;
            }

            if(!hasPermission(token.permissions, "VIEW_UPDATED_AT")) {
                delete x.updatedAt;
            }

            delete x.__v;
            delete x.active;
            delete x.activationToken;

            res.status(200).json({
                success: true,
                user: x
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.post(`${globals.route_start}/account/token/refresh`, async (req, res) => {
        if(!req.body || !req.body.token) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const token = await TokenSchema.findOne({ token: req.body.token });

            if(!token) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            const user = await UserSchema.findOne({ _id: token.userId });

            if(!user) {
                res.status(400).json({
                    error: "Invalid user"
                })
                return;
            }

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1);

            await token.update({
                expiresAt: expiresAt
            })

            res.status(200).json({
                success: true,
                expiresAt: expiresAt
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.post(`${globals.route_start}/account/update/username`, async (req, res) => {
        if(!req.body || !req.body.token || !req.body.newUsername) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const token = await TokenSchema.findOne({ token: req.body.token });

            if(!token) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            if(!hasPermission(token.permissions, "UPDATE_USERNAME")) {
                res.status(403).json({
                    error: "You don't have permission to update username"
                })
                return;
            }

            const user = await UserSchema.findOne({ _id: token.userId });

            if(!user) {
                res.status(400).json({
                    error: "Invalid user"
                })
                return;
            }

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            if(user.username === req.body.newUsername) {
                res.status(400).json({
                    error: "Username already exists"
                })
                return;
            }

            await user.update({
                username: req.body.newUsername
            })

            res.status(200).json({
                success: true,
                message: "Username updated"
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.post(`${globals.route_start}/account/update/password`, async (req, res) => {
        if(!req.body || !req.body.token || !req.body.newPassword) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const token = await TokenSchema.findOne({ token: req.body.token });

            if(!token) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            if(!hasPermission(token.permissions, "UPDATE_PASSWORD")) {
                res.status(403).json({
                    error: "You don't have permission to update password"
                })
                return;
            }

            const user = await UserSchema.findOne({ _id: token.userId });

            if(!user) {
                res.status(400).json({
                    error: "Invalid user"
                })
                return;
            }

            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            const hashedPassword = crypto.createHash("sha256").update(req.body.newPassword).digest("hex");

            await user.update({
                password: hashedPassword
            })

            res.status(200).json({
                success: true,
                message: "Password updated"
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })

    app.post(`${globals.route_start}/account/update/email`, async (req, res) => {
        if(!req.body || !req.body.token || !req.body.newEmail) {
            res.status(400).json({
                error: "Missing parameters"
            })
            return;
        }

        try {
            const token = await TokenSchema.findOne({ token: req.body.token });

            if(!token) {
                res.status(400).json({
                    error: "Invalid token"
                })
                return;
            }

            if(!hasPermission(token.permissions, "UPDATE_EMAIL")) {
                res.status(403).json({
                    error: "You don't have permission to update email"
                })
                return;
            }

            const user = await UserSchema.findOne({ _id: token.userId });

            if(!user) {
                res.status(400).json({
                    error: "Invalid user"
                })
                return;
            }
            
            if(!user.active) {
                res.status(400).json({
                    error: "Account not activated"
                })
                return;
            }

            if(user.email === req.body.newEmail) {
                res.status(400).json({
                    error: "Email already exists"
                })
                return;
            }

            await user.update({
                email: req.body.newEmail
            })

            res.status(200).json({
                success: true,
                message: "Email updated"
            })

        }catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }
    })
}