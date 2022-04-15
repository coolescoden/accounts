/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import {Options} from "./types/Options";
import * as cors from "cors";
import {json} from "body-parser";
import * as mongoose from "mongoose";
import account from "./modules/account";

export function accounts(options: Options): void {

    mongoose.connect(options.mongoUrl, () => {
        console.log("Connected to MongoDB!");
    });

    options.app.use(cors());
    options.app.use(json());

    account(options.app)

}