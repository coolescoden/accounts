/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 */

const express = require('express');
const { accounts } = require("../dist");

const app = express();

accounts({
    app,
    basePath: "/api/v1",
    mongoUrl: "mongodb://localhost:27017/accounts",
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});