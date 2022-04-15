/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import {Express} from "express";

export interface Options {
    basePath: string;
    mongoUrl: string;
    app: Express;
}