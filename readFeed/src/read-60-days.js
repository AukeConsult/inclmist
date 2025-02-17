"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_navfeed_1 = require("./read-navfeed");
const common_es_1 = require("common-es");
// @ts-ignore
const { __dirname, __filename } = (0, common_es_1.getGlobals)(import.meta.url);
const current = new Date();
const fromDate = new Date().setDate(current.getDate() - 60);
(0, read_navfeed_1.readFeed)(fromDate, __dirname);
