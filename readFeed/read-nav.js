import { writeFileSync } from "fs";
import { getGlobals} from "common-es";
import { join } from "path";
import {readFeed} from "./read-api.js";

const { __dirname, __filename } = getGlobals(import.meta.url)
const current = new Date()
const fromDate = new Date().setDate(current.getDate()-30)

await readFeed(fromDate, (num, jobs) => {
    const filename = join(__dirname, "../navdata/job-" + num + ".json")
    console.log("write file ", filename)
    writeFileSync(filename, JSON.stringify(jobs, null, 4), {
        flag: 'w',
    })
});