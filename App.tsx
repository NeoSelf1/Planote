import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoggedInNav from './navigators/LoggedInNav';
import { ApolloProvider } from '@apollo/client';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, persistCache } from 'apollo3-cache-persist';
import client, { cache } from './apollo';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';



export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => {
    setLoading(false);
  };
  const preloadAssets = () => {
    //loadAsync =Promise를 반환
    //모든 Promise들을 어레이형태로 반환할때 까지 wait
    //token, profile과 같은 정보를 pre-fetch할 수 있음
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font: any) => Font.loadAsync(font));
    Promise.all([...fontPromises]);
  };

  const preload = async () => {
    await persistCache({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    return preloadAssets();
  };
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
        <LoggedInNav/>
      </NavigationContainer>
    </ApolloProvider>

  );
}
