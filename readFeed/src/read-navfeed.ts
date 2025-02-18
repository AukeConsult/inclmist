import moment from 'moment';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function readFeed(fromDate: number, saveDir: string) {

    const url = "https://pam-stilling-feed.nav.no"
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aG9tYXMuYXVrZUBqb2JidGVhbS5ubyIsImtpZCI6IjQzOTdmNWY5LWQ4OGQtNDNiZC04NTEwLWRlNDlmMTkxOWI3MCIsImlzcyI6Im5hdi1ubyIsImF1ZCI6ImZlZWQtYXBpLXYyIiwiaWF0IjoxNzM5NDM2MTM5LCJleHAiOm51bGx9.3M-jef4J6Nt4J0EWjoDD0YxAxOwScWbLZ30DYdB7Fso'
    let stopRead = false
    let next_url = '/api/v1/feed'
    let numPosts = 0
    let numPostsActive = 0
    let numPostsDesciption = 0
    let numFile = 0

    const change_date = (moment(fromDate)).format('DD MMM yyyy 00:00:00 +0100')

    const describedJobs = []

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

        var worklist = await response.json() as {
            version:	    string,
            title:	        string,
            home_page_url:	string,
            feed_url:	    string,
            description:	string,
            next_url?:	    string,
            id:	            string,
            next_id?:	    string,
            items:	[]
        };

        let maxDate: Date = new Date(Date.parse("1/1/1970"));

        if (worklist) {
            if (worklist.next_url) {
                next_url = worklist.next_url
                numPosts += worklist.items.length
                for (let post of worklist.items) {

                    let z: Date = new Date(Date.parse(post.date_modified))
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
                            // @ts-ignore
                            if(!("INACTIVE" == descr.status)) {
                                numPostsDesciption++;
                                describedJobs.push({
                                    id: post.id,
                                    post_title: post.title,
                                    content_text: post.content_text,
                                    date_modified: post.date_modified,
                                    title: entry.title,
                                    businessName: entry.businessName,
                                    municipal: entry.municipal,
                                    last_modified: descr.sistEndret,
                                    ad: descr.ad_content
                                })
                            } else {
                                numPostsActive++
                                describedJobs.push({
                                    id: post.id,
                                    post_title: post.title,
                                    content_text: post.content_text,
                                    date_modified: post.date_modified,
                                    title: entry.title,
                                    businessName: entry.businessName,
                                    municipal: entry.municipal,
                                    last_modified: descr.sistEndret
                                })
                            }
                        }
                    }
                }
                console.log(urlPage, numPosts, numPostsActive, numPostsDesciption)
                numFile++

            } else {
                stopRead = true;
            }

            writeFileSync(join(saveDir, "../../navdata/describedJobs-all.json"), JSON.stringify(describedJobs, null, 4), {
                flag: 'w',
            });
        }

    }
    console.log("finish read")

}

