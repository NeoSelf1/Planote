import React, { useState,useRef } from 'react';
import { Text, SafeAreaView } from 'react-native';

import { WebView } from 'react-native-webview';
import OpenCVWeb from '../components/HTML'
import styled from 'styled-components/native';
import { colors } from '../../colors';

export default function CreateNote_2({route}) {
  const [loading, setLoading] = useState(0);
  const webviewRef= useRef()
  const source = OpenCVWeb(route.params.data)
  console.log(route.params.data.length)
  // const NoteInfo = route.params.imgArray;
  
  // const onMessage = (e)=> {
  //   const { type, data } = JSON.parse(e.nativeEvent.data)
  //   if(type ==="noteInfo"){
  //     console.log("Information successully transfered to ViewNote")
  //     // navigation.navigate('ViewNote',{data,selectedImage})
  //     //Temporary Change for Test
  //     setLoading(0)
  //   } else {
  //     console.log(data)
  //   }
  // }
  return (
    <SafeAreaView>
      <Text>CreateNote_2</Text>
      <WebView
        style={{display:'none'}}
        ref={webviewRef}
        source={{html: source}} 
        // onMessage={onMessage}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  )
  }