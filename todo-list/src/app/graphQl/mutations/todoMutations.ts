import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation createTodo(
    $todo: String!, 
    $description: String!, 
    $authorId: ID!
    ) {
    createTodo(todo: $todo, description: $description, authorId: $authorId) {
      id
      todo
      description
      isPending
      authorId
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: ID!
    $todo: String!
    $description: String!
    $isPending: Boolean!
  ) {
    updateTodo(id: $id, todo: $todo, description: $description, isPending: $isPending) {
      id
      todo
      description
      isPending
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;