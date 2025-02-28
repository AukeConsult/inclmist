import Moment from "moment"
import {stripHtml} from "string-strip-html";

export async function readFeed(fromDate, writeFile) {

    const url = "https://pam-stilling-feed.nav.no/"
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aG9tYXMuYXVrZUBqb2JidGVhbS5ubyIsImtpZCI6IjQzOTdmNWY5LWQ4OGQtNDNiZC04NTEwLWRlNDlmMTkxOWI3MCIsImlzcyI6Im5hdi1ubyIsImF1ZCI6ImZlZWQtYXBpLXYyIiwiaWF0IjoxNzM5NDM2MTM5LCJleHAiOm51bGx9.3M-jef4J6Nt4J0EWjoDD0YxAxOwScWbLZ30DYdB7Fso'
    let stopRead = false
    let next_url = '/api/v1/feed'
    let numPosts = 0
    let numPostsActive = 0
    let numPostsDesciption = 0
    let numFile = 0
    let sizePosted = 0;

    let describedJobs = []

    const change_date = (new Moment(fromDate)).format('DD MMM yyyy 00:00:00 +0100')

    while (!stopRead && numPosts<200000) {

        let urlPage = url + next_url;
        var response = await fetch(urlPage, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'If-Modified-Since': change_date,
                'Content-Type': 'application/json'
            }

        })

        var worklist = await response.json()

        let maxDate = new Date(Date.parse("1/1/1970"));

        if (worklist) {
            if (worklist.next_url) {
                next_url = worklist.next_url
                numPosts += worklist.items.length
                for (let post of worklist.items) {

                    let z = new Date(Date.parse(post.date_modified))
                    if(z>maxDate) {
                        maxDate = z;
                    }
                    const entry = post._feed_entry
                    if (entry) {
                        const {status} = entry;
                        if (status != "INACTIVE") {
                            var r = await fetch(url + post.url, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }

                            })

                            var descr = await r.json()
                            if("INACTIVE" != descr.status) {
                                numPostsDesciption++;
                                let ad = descr.ad_content
                                let job = {
                                    id: post.id,
                                    link: descr.link,
                                    applicationUrl: descr.applicationUrl,
                                    applicationUrl2: "https://arbeidsplassen.nav.no/stillinger/stilling/" + post.id,
                                    post_title: post.title,
                                    content_text: post.content_text,
                                    date_modified: post.date_modified,
                                    expires: ad.expires,
                                    title: entry.title,
                                    businessName: entry.businessName,
                                    municipal: entry.municipal,
                                    last_ad_modified: ad.sistEndret,
                                    applicationDue: ad.applicationDue,
                                    occupationCategories: ad.occupationCategories,
                                    employer: ad.employer,
                                    descriptionText: stripHtml(ad.description).result,
                                    categoryList: ad.categoryList,
                                    workLocations: ad.workLocations,
                                    contactList: ad.contactList,
                                    engagementtype: ad.engagementtype,
                                    extent: ad.extent,
                                    starttime: ad.startTime,
                                    positioncount: ad.positioncount,
                                    sector: ad.sector
                                }

                                let size = JSON.stringify(job,4).length
                                sizePosted = sizePosted + size
                                describedJobs.push(job)

                            } else {
                                numPostsActive++
                                let job = {
                                    id: post.id,
                                    applicationUrl: "https://arbeidsplassen.nav.no/stillinger/stilling/" + post.id,
                                    post_title: post.title,
                                    content_text: post.content_text,
                                    date_modified: post.date_modified,
                                    title: entry.title,
                                    businessName: entry.businessName,
                                    municipal: entry.municipal,
                                    last_modified: descr.sistEndret
                                }

                                let size = JSON.stringify(job,4).length
                                sizePosted = sizePosted + size

                                describedJobs.push(job)
                            }

                            if(sizePosted>50000000) {
                                writeFile(numFile,describedJobs)
                                numFile++
                                sizePosted=0
                                describedJobs=[]
                            }

                        }
                    }
                }
                console.log(urlPage, numPosts, numPostsActive, numPostsDesciption, sizePosted)

            } else {
                stopRead = true;
            }
        }
    }
    console.log("finish read")

}