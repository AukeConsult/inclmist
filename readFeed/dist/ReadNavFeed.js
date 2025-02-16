export async function readFeed() {
    const url = "https://pam-stilling-feed.nav.no";
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aG9tYXMuYXVrZUBqb2JidGVhbS5ubyIsImtpZCI6IjQzOTdmNWY5LWQ4OGQtNDNiZC04NTEwLWRlNDlmMTkxOWI3MCIsImlzcyI6Im5hdi1ubyIsImF1ZCI6ImZlZWQtYXBpLXYyIiwiaWF0IjoxNzM5NDM2MTM5LCJleHAiOm51bGx9.3M-jef4J6Nt4J0EWjoDD0YxAxOwScWbLZ30DYdB7Fso';
    let stopRead = false;
    let next_url = '/api/v1/feed';
    let numPosts = 0;
    let numPostsActive = 0;
    while (!stopRead) {
        let urlPage = url + next_url;
        console.log(urlPage, numPosts, numPostsActive);
        var response = await fetch(urlPage, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'If-Modified-Since': '30 Oct 2024 00:00:00 +0200',
                'Content-Type': 'application/json'
            }
        });
        var worklist = await response.json();
        if (worklist) {
            if (worklist.next_url) {
                next_url = worklist.next_url;
                numPosts += worklist.items.length;
                worklist.items.forEach(occupation => {
                    const entry = occupation._feed_entry;
                    if (entry) {
                        if (entry.status === "INACTIVE") {
                            //console.log(entry)
                        }
                        else {
                            numPostsActive++;
                            //console.log("inactive")
                        }
                    }
                });
            }
            else {
                stopRead = true;
            }
        }
    }
    console.log("finish read");
    return numPostsActive;
}
//# sourceMappingURL=ReadNavFeed.js.map