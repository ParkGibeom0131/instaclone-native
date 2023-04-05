import AppLoading from "expo-app-loading";
import * as SplashScreen from 'expo-splash-screen';
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from './apollo';
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, CachePersistor, persistCache } from "apollo3-cache-persist";

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  // Error: Rendered more hooks than during the previous render.
  // => 모든 hook은 항상 렌더링 되어야 함
  const preloadAssets = () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [require("./assets/logo.png")];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]);
  }
  const preload = async () => {
    const token = await AsyncStorage.getItem("token");
    // Promise를 return 하기 전에 token을 AsyncStorage에서 갖고 오는 과정
    // AsyncStorage.remove("token");
    if (token) {
      isLoggedInVar(true);
      // token이 존재한다면 isLoggedInVar을 true
      tokenVar(token);
    }

    const persistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    await persistor.purge();

    return preloadAssets();
  };
  // preload는 반드시 Promise를 return 해야 함
  if (loading) {

    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}
