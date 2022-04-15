"use strict";
/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.accounts = void 0;
var cors = require("cors");
var body_parser_1 = require("body-parser");
var mongoose = require("mongoose");
var account_1 = require("./modules/account");
function accounts(options) {
    mongoose.connect(options.mongoUrl, function () {
        console.log("Connected to MongoDB!");
    });
    options.app.use(cors());
    options.app.use((0, body_parser_1.json)());
    options.app.use(function (err, req, res, next) {
        if (err) {
            res.status(400).json({
                error: err.message
            }).end();
        }
        else {
            next();
        }
    });
    (0, account_1.default)(options.app, options.smtp);
}
exports.accounts = accounts;
//# sourceMappingURL=index.js.map