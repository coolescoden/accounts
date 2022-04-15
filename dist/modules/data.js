"use strict";
/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals = require("../globals");
var Token_1 = require("../models/Token");
var User_1 = require("../models/User");
var Data_1 = require("../models/Data");
var Permissions_1 = require("../Permissions");
function default_1(app) {
    var _this = this;
    app.post("".concat(globals.route_start, "/data/create"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, user, data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.data) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 2:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ _id: token.userId })];
                case 3:
                    user = _a.sent();
                    if (!user) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Data_1.default.create({
                            data: req.body.data,
                            access: [
                                {
                                    userId: user._id,
                                    permissions: ["ADMIN"]
                                }
                            ]
                        })];
                case 4:
                    data = _a.sent();
                    return [4 /*yield*/, data.save()];
                case 5:
                    _a.sent();
                    res.status(200).json({
                        data: data
                    });
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    res.status(500).json({
                        error: e_1.message
                    });
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/data/update"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, user_1, data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.data) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 2:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ _id: token.userId })];
                case 3:
                    user_1 = _a.sent();
                    if (!user_1) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Data_1.default.findOne({ _id: req.body.data._id })];
                case 4:
                    data = _a.sent();
                    if (!data) {
                        res.status(400).json({
                            error: "Invalid data"
                        });
                        return [2 /*return*/];
                    }
                    if (!data.access.some(function (access) { return access.userId.toString() === user_1._id.toString(); })) {
                        res.status(403).json({
                            error: "No access"
                        });
                        return [2 /*return*/];
                    }
                    data.data = req.body.data.data;
                    return [4 /*yield*/, data.save()];
                case 5:
                    _a.sent();
                    res.status(200).json({
                        data: data
                    });
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    res.status(500).json({
                        error: e_2.message
                    });
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/data/get"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, user_2, data, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.dataId) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 2:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ _id: token.userId })];
                case 3:
                    user_2 = _a.sent();
                    if (!user_2) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Data_1.default.findOne({ _id: req.body.dataId })];
                case 4:
                    data = _a.sent();
                    if (!data) {
                        res.status(400).json({
                            error: "Invalid data"
                        });
                        return [2 /*return*/];
                    }
                    if (!data.access.some(function (access) { return access.userId.toString() === user_2._id.toString(); })) {
                        res.status(403).json({
                            error: "No access"
                        });
                        return [2 /*return*/];
                    }
                    res.status(200).json({
                        data: data
                    });
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _a.sent();
                    res.status(500).json({
                        error: e_3.message
                    });
                    return [2 /*return*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/data/delete"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, user_3, data, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.dataId) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 2:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ _id: token.userId })];
                case 3:
                    user_3 = _a.sent();
                    if (!user_3) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Data_1.default.findOne({ _id: req.body.dataId })];
                case 4:
                    data = _a.sent();
                    if (!data) {
                        res.status(400).json({
                            error: "Invalid data"
                        });
                        return [2 /*return*/];
                    }
                    if (!data.access.some(function (access) { return access.userId.toString() === user_3._id.toString(); })) {
                        res.status(403).json({
                            error: "No access"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, data.remove()];
                case 5:
                    _a.sent();
                    res.status(200).json({
                        data: data
                    });
                    return [3 /*break*/, 7];
                case 6:
                    e_4 = _a.sent();
                    res.status(500).json({
                        error: e_4.message
                    });
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/data/permissions/set"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, user_4, data, userPermissions, userToSet_1, userToSetPermissions, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.dataId || !req.body.permissions || !req.body.user) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 2:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ _id: token.userId })];
                case 3:
                    user_4 = _a.sent();
                    if (!user_4) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Data_1.default.findOne({ _id: req.body.dataId })];
                case 4:
                    data = _a.sent();
                    if (!data) {
                        res.status(400).json({
                            error: "Invalid data"
                        });
                        return [2 /*return*/];
                    }
                    if (!data.access.some(function (access) { return access.userId.toString() === user_4._id.toString(); })) {
                        res.status(403).json({
                            error: "No access"
                        });
                        return [2 /*return*/];
                    }
                    userPermissions = data.access.find(function (access) { return access.userId.toString() === user_4._id.toString(); }).permissions;
                    if (!userPermissions) {
                        res.status(403).json({
                            error: "No permissions"
                        });
                        return [2 /*return*/];
                    }
                    if (!(0, Permissions_1.hasPermission)(userPermissions, "DATA_SET_PERMISSIONS")) {
                        res.status(403).json({
                            error: "No permissions"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ name: req.body.user })];
                case 5:
                    userToSet_1 = _a.sent();
                    if (!userToSet_1) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    userToSetPermissions = data.access.find(function (access) { return access.userId.toString() === userToSet_1._id.toString(); });
                    if (!!userToSetPermissions) return [3 /*break*/, 7];
                    data.access.push({
                        userId: userToSet_1._id,
                        permissions: req.body.permissions
                    });
                    return [4 /*yield*/, data.save()];
                case 6:
                    _a.sent();
                    res.status(200).json({
                        data: data
                    });
                    return [2 /*return*/];
                case 7:
                    data.access.find(function (access) { return access.userId.toString() === userToSet_1._id.toString(); }).permissions = req.body.permissions;
                    return [4 /*yield*/, data.save()];
                case 8:
                    _a.sent();
                    res.status(200).json({
                        data: data
                    });
                    return [3 /*break*/, 10];
                case 9:
                    e_5 = _a.sent();
                    res.status(500).json({
                        error: e_5.message
                    });
                    return [2 /*return*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/data/permissions/remove_user"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var token, user_5, data, userPermissions, userToRemove_1, userToRemovePermissions, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.dataId || !req.body.user) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 2:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ _id: token.userId })];
                case 3:
                    user_5 = _a.sent();
                    if (!user_5) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Data_1.default.findOne({ _id: req.body.dataId })];
                case 4:
                    data = _a.sent();
                    if (!data) {
                        res.status(400).json({
                            error: "Invalid data"
                        });
                        return [2 /*return*/];
                    }
                    if (!data.access.some(function (access) { return access.userId.toString() === user_5._id.toString(); })) {
                        res.status(403).json({
                            error: "No access"
                        });
                        return [2 /*return*/];
                    }
                    userPermissions = data.access.find(function (access) { return access.userId.toString() === user_5._id.toString(); }).permissions;
                    if (!userPermissions) {
                        res.status(403).json({
                            error: "No permissions"
                        });
                        return [2 /*return*/];
                    }
                    if (!(0, Permissions_1.hasPermission)(userPermissions, "DATA_SET_PERMISSIONS")) {
                        res.status(403).json({
                            error: "No permissions"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_1.default.findOne({ name: req.body.user })];
                case 5:
                    userToRemove_1 = _a.sent();
                    if (!userToRemove_1) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    userToRemovePermissions = data.access.find(function (access) { return access.userId.toString() === userToRemove_1._id.toString(); });
                    if (!userToRemovePermissions) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    data.access.splice(data.access.indexOf(userToRemovePermissions), 1);
                    return [4 /*yield*/, data.save()];
                case 6:
                    _a.sent();
                    res.status(200).json({
                        data: data
                    });
                    return [3 /*break*/, 8];
                case 7:
                    e_6 = _a.sent();
                    res.status(500).json({
                        error: e_6.message
                    });
                    return [2 /*return*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
}
exports.default = default_1;
//# sourceMappingURL=data.js.map