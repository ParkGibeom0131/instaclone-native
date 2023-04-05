import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
    getMainDefinition,
    offsetLimitPagination,
} from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUploadLink } from "apollo-upload-client";

export const isLoggedInVar = makeVar(false);
// React Native는 AsyncStorage가 있는데, 이는 promise에 기반한 API
// React Native는 직접 
// React Native에서는 isLoggedIn은 default값이 항상 false
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token) => {
    await AsyncStorage.setItem(TOKEN, token);
    // AsyncStorage에 많은 것을 저장할 수 있음
    isLoggedInVar(true);
    // 사용자가 로그인할 때, variable을 여기서 바꿈
    tokenVar(token);
    // token을 reactive variable에 저장 => 더 쉽고 더 빠르게 접근가능
    // 나중에 token을 backend에 보내고 싶을 때 매번 token에 접근해서 그 token을
    // request의 헤더에 넣어야 할 것을 알고 있기 때문 즉,
    // 모든 request에 token을 넣어야 하기 때문에 reactive variable에 token을 저장
    // await, AsyncStorage, getItem을 하는 것은 너무 느리기 때문에 reactive variable 사용
};

export const logUserOut = async () => {
    await AsyncStorage.removeItem(TOKEN);
    isLoggedInVar(false);
    tokenVar(null);
}

const httpLink = createHttpLink({

});

const uploadHttpLink = createUploadLink({
    uri: "https://bab3-121-168-143-249.jp.ngrok.io/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: tokenVar(),
        },
    };
});

// export const cache = new InMemoryCache({
//     typePolicies: {
//         Query: {
//             fields: {
//                 seeFeed: offsetLimitPagination(),
//             },
//         },
//     },
// });

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // keyArgs: false,
                // merge(existing = [], incoming = []) {
                //     return [...existing, ...incoming];
                // },
                seeFeed: offsetLimitPagination(),
            },
        },
    },
})

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        console.log(`GraphQL Error`, graphQLErrors);
    }
    if (networkError) {
        console.log(`Network Error`, networkError);
    }
});

const client = new ApolloClient({
    link: authLink.concat(onErrorLink).concat(uploadHttpLink),
    // httpLink가 마지막으로 종료되는 link이기 때문에 마지막에 concat
    cache,
});

export default client;