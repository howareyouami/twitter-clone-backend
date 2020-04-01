
export const getAllUsers = `query GetUser {
    allUsers {
      name
      id
      _tweetsMeta {
        count
      }
    }
  }`