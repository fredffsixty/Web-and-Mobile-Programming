async function fetchAndUpdatePosts() {
    let posts;

    try {
        posts = await fetchPosts();

        doSomethingWithPosts(posts); // throws an error

    } catch {
        console.log('error in fetching posts');
        // catches error both for fetchPosts and doSomethingWithPosts
    }
    if (!posts) {
        return;
    }

    try {
        await updatePosts();
    } catch {
        console.log('error in updating posts');
    }
}