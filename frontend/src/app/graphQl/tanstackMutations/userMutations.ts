export const SIGN_UP =`
  mutation signUp(
    $name: String!, 
    $email: String!, 
    $password: String!
    ) {
    signUp(name: $name, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

export const SIGN_IN =`
  mutation signIn(
    $email: String!, 
    $password: String!
    ) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SIGN_OUT =`
  mutation signOut {
    signOut
  }
`;