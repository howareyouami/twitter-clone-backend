
export const GET_ALL_TWEETS = `query getAllTweets {
  allTweets {
    content,
    dateCreated,
    author {
      name
    }
  }
}`