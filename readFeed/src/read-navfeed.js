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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFeed = readFeed;
const moment_1 = __importDefault(require("moment"));
const fs_1 = require("fs");
const path_1 = require("path");
function readFeed(fromDate, saveDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://pam-stilling-feed.nav.no";
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aG9tYXMuYXVrZUBqb2JidGVhbS5ubyIsImtpZCI6IjQzOTdmNWY5LWQ4OGQtNDNiZC04NTEwLWRlNDlmMTkxOWI3MCIsImlzcyI6Im5hdi1ubyIsImF1ZCI6ImZlZWQtYXBpLXYyIiwiaWF0IjoxNzM5NDM2MTM5LCJleHAiOm51bGx9.3M-jef4J6Nt4J0EWjoDD0YxAxOwScWbLZ30DYdB7Fso';
        let stopRead = false;
        let next_url = '/api/v1/feed';
        let numPosts = 0;
        let numPostsActive = 0;
        let numPostsDesciption = 0;
        let numFile = 0;
        const change_date = ((0, moment_1.default)(fromDate)).format('DD MMM yyyy 00:00:00 +0100');
        while (!stopRead) {
            let urlPage = url + next_url;
            var response = yield fetch(urlPage, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'If-Modified-Since': change_date,
                    'Content-Type': 'application/json'
                }
            });
            const activeJobs = [];
            const describedJobs = [];
            var worklist = yield response.json();
            let maxDate = new Date(Date.parse("1/1/1970"));
            if (worklist) {
                if (worklist.next_url) {
                    next_url = worklist.next_url;
                    numPosts += worklist.items.length;
                    for (let item of worklist.items) {
                        const x = item;
                        let z = new Date(Date.parse(x.date_modified));
                        if (z > maxDate) {
                            maxDate = z;
                        }
                        const entry = x._feed_entry;
                        if (entry) {
                            const { status } = entry;
                            if (status === "INACTIVE") {
                                //console.log(entry)
                            }
                            else {
                                var r = yield fetch(url + x.url, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                var descr = yield r.json();
                                // @ts-ignore
                                if (!("INACTIVE" == descr.status)) {
                                    numPostsDesciption++;
                                    describedJobs.push({
                                        id: x.id,
                                        entry: entry,
                                        descr: descr
                                    });
                                }
                                else {
                                    numPostsActive++;
                                    activeJobs.push({
                                        id: x.id,
                                        entry: entry,
                                        descr: descr
                                    });
                                }
                            }
                        }
                    }
                    console.log(urlPage, numPosts, numPostsActive, numPostsDesciption);
                    (0, fs_1.writeFileSync)((0, path_1.join)(saveDir, "../../navdata/describedJobs-" + numFile + ".json"), JSON.stringify(describedJobs, null, 4), {
                        flag: 'w',
                    });
                    (0, fs_1.writeFileSync)((0, path_1.join)(saveDir, "../../navdata/activeJobs-" + numFile + ".json"), JSON.stringify(activeJobs, null, 4), {
                        flag: 'w',
                    });
                    numFile++;
                }
                else {
                    stopRead = true;
                }
            }
        }
        console.log("finish read");
    });
}
