function fetchAndUpdatePosts() {
    fetchPosts()
        .then((posts) => {
            updatePosts(posts)
                .catch((err) => {
                    console.log('error in updating posts');
                });
        })
        .catch(() => {
            console.log('error in fetching posts');
        });
}