import { WebView } from 'react-native-webview';
import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import WebviewContainer from './src/screens/WebviewContainer';
import { NavigationContainer } from '@react-navigation/native';
import LoggedInNav from './navigators/LoggedInNav';
import client from './apollo';
import { ApolloProvider } from '@apollo/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <LoggedInNav/>
      </NavigationContainer>
    </ApolloProvider>

  );
}
