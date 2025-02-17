import {readFeed} from "./read-navfeed";
import { getGlobals } from 'common-es'
// @ts-ignore
const { __dirname, __filename } = getGlobals(import.meta.url)

const current = new Date()

const fromDate = new Date().setDate(current.getDate()-60)

readFeed(fromDate,__dirname);