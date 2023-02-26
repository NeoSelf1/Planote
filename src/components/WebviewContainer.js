import { WebView } from 'react-native-webview';
import React, {useEffect, useRef } from 'react';
import { Text, View ,Button,Image} from 'react-native';

export default function WebviewContainer({route:{params}}) {
  const webviewRef= useRef()
  const source=`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <script async src="https://docs.opencv.org/3.4/opencv.js"></script>
      <!--script async src="./opencv.js"></script-->
      <script>
        function onload(){
          window.ReactNativeWebView.postMessage("Opencv.js loaded");
        }
        function communicate(){
          if(window.ReactNativeWebView) { 
            window.ReactNativeWebView.postMessage('Wayne is coming again')
          }
        }
      </script>
      <script>
        window.addEventListener('message', (event) => {
          alert(event.data)
          window.ReactNativeWebView.postMessage(event.data);
        });
      </script>
      
    </head>
    <body onload="onload()">
      <script>
        function setImageUri(uri) {
          var img = document.getElementById("myImage");
          img.src = uri;
        }
      </script>
      <button onClick="communicate()">
      Hello
      </button>
      <img id="myImage" src="">
    </body>
  </html>`
  //html파일에서 postmessage로 보낸 메세지를 출력해주는 구문
  const onLoadEnd= ()=>{
    console.log("onLoadEnd")
    //webview로 메세지를 전송함
  }
  

  return (
    <View style={{flex:1, padding:'10%'}}>
      <WebView 
      ref={webviewRef}
      javaScriptEnabled={true}
      onLoadEnd={onLoadEnd}
      //웹뷰에서 네이티브로 보내는 메세지를 받는 함수
      onMessage={(event) => console.log("HTML에서 웹뷰로 보내는 메세지:",event.nativeEvent.data)}
      injectedJavaScript={`setImageUri('${params?.imageUri})`}
      source={{html: source}} 
      />
    </View>
  );
}
