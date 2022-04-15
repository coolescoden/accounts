/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import {Express} from "express";
import * as globals from '../globals';
import TokenSchema from "../models/Token";
import UserSchema from "../models/User";
import DataSchema from "../models/Data";
import {hasPermission} from "../Permissions";

export default function (app: Express) {
    app.post(`${globals.route_start}/data/create`, async (req, res) => {
        if (!req.body || !req.body.token || !req.body.data) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }

        try {
            const token = await TokenSchema.findOne({token: req.body.token});

            if (!token) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }

            const user = await UserSchema.findOne({_id: token.userId});

            if (!user) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const data = await DataSchema.create({
                data: req.body.data,
                access: [
                    {
                        userId: user._id,
                        permissions: ["ADMIN"]
                    }
                ]
            })

            await data.save();

            res.status(200).json({
                data: data
            });

        } catch (e) {
            res.status(500).json({
                error: e.message
            });
            return;
        }

    });

    app.post(`${globals.route_start}/data/update`, async (req, res) => {
        if (!req.body || !req.body.token || !req.body.data) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }

        try {
            const token = await TokenSchema.findOne({token: req.body.token});

            if (!token) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }

            const user = await UserSchema.findOne({_id: token.userId});

            if (!user) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const data = await DataSchema.findOne({_id: req.body.data._id});

            if (!data) {
                res.status(400).json({
                    error: "Invalid data"
                });
                return;
            }

            if (!data.access.some(access => access.userId.toString() === user._id.toString())) {
                res.status(403).json({
                    error: "No access"
                });
                return;
            }

            data.data = req.body.data.data;

            await data.save();

            res.status(200).json({
                data: data
            });
        } catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }

    });

    app.post(`${globals.route_start}/data/get`, async (req, res) => {
        if (!req.body || !req.body.token || !req.body.dataId) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }

        try {
            const token = await TokenSchema.findOne({token: req.body.token});

            if (!token) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }

            const user = await UserSchema.findOne({_id: token.userId});

            if (!user) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const data = await DataSchema.findOne({_id: req.body.dataId});

            if (!data) {
                res.status(400).json({
                    error: "Invalid data"
                });
                return;
            }

            if (!data.access.some(access => access.userId.toString() === user._id.toString())) {
                res.status(403).json({
                    error: "No access"
                });
                return;
            }

            res.status(200).json({
                data: data
            });
        } catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }

    });

    app.post(`${globals.route_start}/data/delete`, async (req, res) => {
        if (!req.body || !req.body.token || !req.body.dataId) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }

        try {
            const token = await TokenSchema.findOne({token: req.body.token});

            if (!token) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }

            const user = await UserSchema.findOne({_id: token.userId});

            if (!user) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const data = await DataSchema.findOne({_id: req.body.dataId});

            if (!data) {
                res.status(400).json({
                    error: "Invalid data"
                });
                return;
            }

            if (!data.access.some(access => access.userId.toString() === user._id.toString())) {
                res.status(403).json({
                    error: "No access"
                });
                return;
            }

            if(!hasPermission(data.access.some(access => access.userId.toString() === user._id.toString()), "DATA_DELETE")) {
                res.status(403).json({
                    error: "No access"
                });
                return;
            }

            await data.remove();

            res.status(200).json({
                data: data
            });
        } catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }

    });

    app.post(`${globals.route_start}/data/permissions/set`, async (req, res) => {
        if (!req.body || !req.body.token || !req.body.dataId || !req.body.permissions || !req.body.user) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }

        try {
            const token = await TokenSchema.findOne({token: req.body.token});

            if (!token) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }

            const user = await UserSchema.findOne({_id: token.userId});

            if (!user) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const data = await DataSchema.findOne({_id: req.body.dataId});

            if (!data) {
                res.status(400).json({
                    error: "Invalid data"
                });
                return;
            }

            if (!data.access.some(access => access.userId.toString() === user._id.toString())) {
                res.status(403).json({
                    error: "No access"
                });
                return;
            }

            const userPermissions = data.access.find(access => access.userId.toString() === user._id.toString()).permissions;

            if (!userPermissions) {
                res.status(403).json({
                    error: "No permissions"
                });
                return;
            }

            if (!hasPermission(userPermissions, "DATA_SET_PERMISSIONS")) {
                res.status(403).json({
                    error: "No permissions"
                });
                return;
            }

            const userToSet = await UserSchema.findOne({name: req.body.user});

            if (!userToSet) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const userToSetPermissions = data.access.find(access => access.userId.toString() === userToSet._id.toString());


            if (!userToSetPermissions) {
                data.access.push({
                    userId: userToSet._id,
                    permissions: req.body.permissions
                });

                await data.save();

                res.status(200).json({
                    data: data
                });

                return;
            }

            data.access.find(access => access.userId.toString() === userToSet._id.toString()).permissions = req.body.permissions;

            await data.save();

            res.status(200).json({
                data: data
            });

        } catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }

    });

    app.post(`${globals.route_start}/data/permissions/remove_user`, async (req, res) => {
        if (!req.body || !req.body.token || !req.body.dataId || !req.body.user) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }

        try {
            const token = await TokenSchema.findOne({token: req.body.token});

            if (!token) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }

            const user = await UserSchema.findOne({_id: token.userId});

            if (!user) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            const data = await DataSchema.findOne({_id: req.body.dataId});

            if (!data) {
                res.status(400).json({
                    error: "Invalid data"
                });
                return;
            }

            if (!data.access.some(access => access.userId.toString() === user._id.toString())) {
                res.status(403).json({
                    error: "No access"
                });
                return;
            }

            const userPermissions = data.access.find(access => access.userId.toString() === user._id.toString()).permissions;

            if (!userPermissions) {
                res.status(403).json({
                    error: "No permissions"
                });
                return;
            }

            if (!hasPermission(userPermissions, "DATA_REMOVE_USER")) {
                res.status(403).json({
                    error: "No permissions"
                });
                return;
            }

            const userToRemove = await UserSchema.findOne({name: req.body.user});

            if (!userToRemove) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;

            }

            const userToRemovePermissions = data.access.find(access => access.userId.toString() === userToRemove._id.toString());

            if (!userToRemovePermissions) {
                res.status(400).json({
                    error: "Invalid user"
                });
                return;
            }

            data.access.splice(data.access.indexOf(userToRemovePermissions), 1);

            await data.save();

            res.status(200).json({
                data: data
            });

        } catch (e) {
            res.status(500).json({
                error: e.message
            })
            return;
        }

    });
}