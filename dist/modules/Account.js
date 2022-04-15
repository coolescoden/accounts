"use strict";
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
var User_1 = require("../models/User");
var crypto = require("crypto");
var StringUtil_1 = require("../StringUtil");
var nodemailer = require("nodemailer");
var Token_1 = require("../models/Token");
function default_1(app, smtp) {
    var _this = this;
    var transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: smtp.auth
    });
    app.post("".concat(globals.route_start, "/account/create"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var acToken, user, info, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.username || !req.body.password || !req.body.email) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, User_1.default.find({ name: req.body.username }).countDocuments()];
                case 2:
                    if ((_a.sent()) > 0) {
                        res.status(400).json({
                            error: "Username already exists"
                        });
                        return [2 /*return*/];
                    }
                    acToken = req.body.username + "$" + (0, StringUtil_1.randomString)(48);
                    return [4 /*yield*/, User_1.default.create({
                            name: req.body.username,
                            password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
                            email: req.body.email,
                            active: false,
                            activationToken: acToken
                        })];
                case 3:
                    user = _a.sent();
                    return [4 /*yield*/, user.save()];
                case 4:
                    _a.sent();
                    console.log("Created user ".concat(user.name, " with id ").concat(user._id));
                    return [4 /*yield*/, transporter.sendMail({
                            from: smtp.displayName + " <" + smtp.auth.user + ">",
                            to: user.email,
                            subject: "Account activation",
                            text: "Hello ".concat(user.name, ",\n\nPlease click on the following link to activate your account:\n\n").concat(req.protocol + "//" + req.hostname).concat(globals.route_start, "/account/activate/").concat(acToken, "\n\nThank you!"),
                            html: "<p>Hello ".concat(user.name, ",</p><p>Please click on the following link to activate your account:</p><p><a href=\"").concat(req.protocol + "//" + req.hostname).concat(globals.route_start, "/account/activate/").concat(acToken, "\">").concat(req.protocol + "//" + req.hostname).concat(globals.route_start, "/account/activate/").concat(acToken, "</a></p><p>Thank you!</p>")
                        })];
                case 5:
                    info = _a.sent();
                    console.log("Message sent: %s", info.messageId);
                    res.status(200).json({
                        success: true,
                        user: user
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
    app.get("".concat(globals.route_start, "/account/activate/:token"), function (req, res) {
        if (!req.params || !req.params.token) {
            res.status(400).json({
                error: "Missing parameters"
            });
            return;
        }
        User_1.default.findOne({ activationToken: req.params.token }, function (err, user) {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
                return;
            }
            if (!user) {
                res.status(400).json({
                    error: "Invalid token"
                });
                return;
            }
            user.active = true;
            user.activationToken = "";
            user.save(function (err) {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    user: user
                });
            });
        });
    });
    app.post("".concat(globals.route_start, "/account/delete"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user, info, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.username || !req.body.password) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, User_1.default.findOne({ name: req.body.username, password: crypto.createHash("sha256").update(req.body.password).digest("hex") })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        res.status(400).json({
                            error: "Invalid credentials"
                        });
                        return [2 /*return*/];
                    }
                    user.deletionToken = user.name + "$" + (0, StringUtil_1.randomString)(48);
                    return [4 /*yield*/, user.save()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, transporter.sendMail({
                            from: smtp.displayName + " <" + smtp.auth.user + ">",
                            to: user.email,
                            subject: "Account deletion",
                            text: "Hello ".concat(user.name, ",\n\nPlease click on the following link to delete your account:\n\n").concat(req.protocol + "//" + req.hostname).concat(globals.route_start, "/account/delete/").concat(user.deletionToken, "\n\nThank you!"),
                            html: "<p>Hello ".concat(user.name, ",</p><p>Please click on the following link to delete your account:</p><p><a href=\"").concat(req.protocol + "//" + req.hostname).concat(globals.route_start, "/account/delete/").concat(user.deletionToken, "\">").concat(req.protocol + "//" + req.hostname).concat(globals.route_start, "/account/delete/").concat(user.activationToken, "</a></p><p>Thank you!</p>")
                        })];
                case 4:
                    info = _a.sent();
                    console.log("Message sent: %s", info.messageId);
                    res.status(200).json({
                        success: true,
                        message: "An email has been sent to you to confirm the deletion of your account"
                    });
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    res.status(500).json({
                        error: e_2.message
                    });
                    return [2 /*return*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    app.get("".concat(globals.route_start, "/account/delete/:token"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params || !req.params.token) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, User_1.default.findOne({ deletionToken: req.params.token })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user.remove()];
                case 3:
                    _a.sent();
                    res.status(200).json({
                        success: true,
                        message: "Your account has been deleted"
                    });
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    res.status(500).json({
                        error: e_3.message
                    });
                    return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/account/token/create"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user, permissions, expiresAt, token, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.username && !req.body.password) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, User_1.default.findOne({ name: req.body.username, password: crypto.createHash("sha256").update(req.body.password).digest("hex") })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        res.status(400).json({
                            error: "Invalid credentials"
                        });
                        return [2 /*return*/];
                    }
                    permissions = ["ADMIN"];
                    expiresAt = new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 30);
                    if (req.body.permissions) {
                        permissions = req.body.permissions;
                    }
                    return [4 /*yield*/, Token_1.default.create({
                            token: (0, StringUtil_1.randomString)(64),
                            userId: user._id,
                            permissions: permissions,
                            expiresAt: expiresAt
                        })];
                case 3:
                    token = _a.sent();
                    res.status(200).json({
                        success: true,
                        token: token.token,
                        expiresAt: expiresAt
                    });
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    res.status(500).json({
                        error: e_4.message
                    });
                    return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    app.post("".concat(globals.route_start, "/account/token/delete"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user, token, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.token || !req.body.username || !req.body.password) {
                        res.status(400).json({
                            error: "Missing parameters"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, User_1.default.findOne({ name: req.body.username, password: crypto.createHash("sha256").update(req.body.password).digest("hex") })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        res.status(400).json({
                            error: "Invalid credentials"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Token_1.default.findOne({ token: req.body.token })];
                case 3:
                    token = _a.sent();
                    if (!token) {
                        res.status(400).json({
                            error: "Invalid token"
                        });
                        return [2 /*return*/];
                    }
                    if (token.userId.toString() !== user._id.toString()) {
                        res.status(400).json({
                            error: "Invalid user"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, token.remove()];
                case 4:
                    _a.sent();
                    res.status(200).json({
                        success: true,
                        message: "Token deleted"
                    });
                    return [3 /*break*/, 6];
                case 5:
                    e_5 = _a.sent();
                    res.status(500).json({
                        error: e_5.message
                    });
                    return [2 /*return*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
}
exports.default = default_1;
//# sourceMappingURL=account.js.map