export const GET_USER =`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      todos {
        id
        todo
        description
        isPending
        authorId
        author {
          username
        }
      }
    }
  }
`;
