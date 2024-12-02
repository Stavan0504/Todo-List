import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
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
`;

export const GET_TODO = gql`
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
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
`;

export const GET_USER_TODOS =gql `
  query GetUserTodos($userId: ID!) {
    getUserTodos(userId: $userId) {
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
`;