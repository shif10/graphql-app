import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.REACT_APP_URL,
    cache: new InMemoryCache(),
});

export default client;
