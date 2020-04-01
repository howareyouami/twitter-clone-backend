
export const GET_ALL_USERS = `query getAllUsers {
    allUsers {
      name
      id
      _tweetsMeta {
        count
      }
    }
  }`