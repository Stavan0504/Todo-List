import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql', // Replace with your backend GraphQL endpoint
  }),
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export default client;



// import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

// import { setContext } from "@apollo/client/link/context"

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem("new-user-token")
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : null,
//     },
//   }
// })

// const HttpLink = createHttpLink({
//   uri: "http://localhost:4000",
// })

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: authLink.concat(HttpLink),
// })

// export default client





