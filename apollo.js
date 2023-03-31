import { ApolloClient, makeVar } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const isLoggedInVar = makeVar(false);
// React Native는 AsyncStorage가 있는데, 이는 promise에 기반한 API
// React Native는 직접 
export const tokenVar = makeVar("");

export const logUserIn = async (token) => {
    await AsyncStorage.multiSet([
        ["token", JSON.stringify(token)],
        ["loggedIn", JSON.stringify("yes")]
    ]);
    isLoggedInVar(true);
    tokenVar(token);
};

const client = new ApolloClient({
    uri: "https://9df9-121-168-143-249.jp.ngrok.io/graphql",
    cache: new InMemoryCache(),
});

export default client;