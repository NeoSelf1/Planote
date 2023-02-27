import { WebView } from 'react-native-webview';
import React, {useEffect, useRef } from 'react';
import { Text, View ,Button,Image, TouchableOpacity} from 'react-native';

export default function WebviewContainer({route:{params}}) {
  const webviewRef= useRef()
  const source=`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <script src="functions.js"></script>
      <script async src="https://docs.opencv.org/3.4/opencv.js"></script>
    </head>
    <body onload="onload()">
      <img id="test" alt="">
      <script>
      var myImage;
      var myUri;
        function setImageUri(uri) {
          myImage = document.getElementById("test");
          myImage.src=uri
          myUri=uri
        }
        document.addEventListener('message', (event) => {
          setImageUri(event.data)
        });
        var Module = {
          onRuntimeInitialized() {
            const img_gray= new cv.Mat(); 
            let mat= cv.imread(myImage.src);
            window.ReactNativeWebView.postMessage(myImage);
            cv.cvtColor(mat,img_gray, cv.COLOR_BGR2GRAY, 0);
          }
        }
      </script>
      <script async src="./opencv.js" type="text/javascript"></script>
    </body>
  </html>`
  //html파일에서 postmessage로 보낸 메세지를 출력해주는 구문
  const onLoadEnd= ()=>{
    console.log("2.이미지URI Webview로 전송됨")
    webviewRef.current.postMessage(params.imageUri)
  }

  return (
    <View style={{flex:1, padding:'10%'}}>
      <WebView 
      ref={webviewRef}
      javaScriptEnabled={true}
      onLoadEnd={onLoadEnd}
      //웹뷰에서 네이티브로 보내는 메세지를 받는 함수
      onMessage={(event) => console.log("HTML에서 웹뷰로 보내는 메세지:",event.nativeEvent.data)}
      source={{html: source}} 
      />
    </View>
  );
}
