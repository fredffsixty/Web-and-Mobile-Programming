async function fetchAndUpdatePosts() {
    const posts = await fetchPosts().catch(() => {
        console.log('error in fetching posts');
    });

    if (posts) {
        doSomethingWithPosts(posts);
    }
}