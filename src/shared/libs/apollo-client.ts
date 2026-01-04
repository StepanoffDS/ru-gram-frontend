import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  credentials: 'include',
});

const createWsLink = () => {
  if (typeof window === 'undefined') return null;

  const client = createClient({
    url: process.env.NEXT_PUBLIC_SUBSCRIPTIONS_URL || '',
    connectionParams: async () => {
      const cookies = document.cookie;
      return {
        headers: {
          cookie: cookies,
        },
      };
    },
    on: {
      opened: () => {
        console.log('WebSocket connection opened');
      },
      closed: () => {
        console.log('WebSocket connection closed');
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      },
    },
  });

  return new GraphQLWsLink(client);
};

const wsLink = createWsLink();

const link = wsLink
  ? split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return (
          def.kind === 'OperationDefinition' && def.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    )
  : httpLink;

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
