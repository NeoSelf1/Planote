import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    makeVar,
  } from '@apollo/client';
  import { setContext } from '@apollo/client/link/context';
  
  export const tokenVar: any = makeVar('');
  const TOKEN = 'token';
  
  export const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seeNote: {
            keyArgs: false,
            //   //인자에 따라서 Query들을 구별시키는 것을 방지하여,
            //   //Feeds에서 seeFeed Query의 offset가 변경될 때,
            //   //다른 Query로 취급하여 변경되었다는 것으로 인식하지 않아 리렌더를 안하는 문제 방지
            //   //여기서 keyArgs는 offset
            // merge(existing = [], incoming: any[]) {
            //   return [...existing, ...incoming];
            // },
            //   // [], [1,2] => []+[1,2] = [1,2]
            //   //[1,2] [3] => [1,2,3]
            // },
            // cache: new InMemoryCache({
            //   typePolicies: {
            //     Query: {
            //       fields: {
            //         seeFeed: offsetLimitPagination(),
            //       },
            //     },
            //   },
            // }),
          },
        },
      },
    },
  });
  const httpLink = createHttpLink({
    uri: 'https://planote-backend.herokuapp.com',
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        token: tokenVar(),
      },
    };
  });
  const client = new ApolloClient({
    link: httpLink,
    cache:new InMemoryCache(),

  });
  export default client;
  