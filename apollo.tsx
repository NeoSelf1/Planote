import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    makeVar,
  } from '@apollo/client';
//   import AsyncStorage from '@react-native-async-storage/async-storage';
  import { setContext } from '@apollo/client/link/context';
  
//   export const isLoggedInVar = makeVar(false);
  export const tokenVar: any = makeVar('');
  
//   const TOKEN = 'token';
  
//   export const logUserIn = async (token: any) => {
//     await AsyncStorage.setItem(TOKEN, token);
//     isLoggedInVar(true);
//     //token 기록을 안하고 로그인을 진행할 경우, authlink에서 먹힘
//     tokenVar(token);
//   };
  
  const httpLink = createHttpLink({
    uri: 'https://eb12-2001-e60-9147-9567-146c-d2bc-26d5-3536.ngrok-free.app/graphql',
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        token: tokenVar(),
      },
    };
  });
  
//   export const logUserOut = async () => {
//     await AsyncStorage.removeItem(TOKEN);
//     isLoggedInVar(false);
//     tokenVar(null);
//   };
  
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
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
  export default client;
  