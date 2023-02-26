import { WebView } from 'react-native-webview';
import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import WebviewContainer from './src/components/WebviewContainer';
import { NavigationContainer } from '@react-navigation/native';
import LoggedInNav from './navigators/LoggedInNav';


export default function App() {
  return (
    <NavigationContainer>
      <LoggedInNav/>
    </NavigationContainer>
  );
}
