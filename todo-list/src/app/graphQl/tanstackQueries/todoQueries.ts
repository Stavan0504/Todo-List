export const GET_TODOS =`
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

export const GET_TODO =`
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

export const GET_USER_TODOS =`
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