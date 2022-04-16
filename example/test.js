/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 */

const express = require('express');
const {accounts} = require("../dist");
const nodemailer = require('nodemailer');


(async () => {

    const app = express();

    accounts({
        app,
        basePath: "/api/v1",
        mongoUrl: "mongodb://localhost:27017/accounts",
        smtp: {
            host: "mail.mailone24.de",
            port: 587,
            secure: false,
            auth: {
                user: "not-real@coolescoden.de",
                pass: "KmLfVtBsftXkbR8!"
            },
            displayName: "Sample Account System"
        }
    })

    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });
})();