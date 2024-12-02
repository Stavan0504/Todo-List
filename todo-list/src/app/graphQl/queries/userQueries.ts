import { gql } from '@apollo/client';

export const GET_USER = gql`
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
