import React, { useState,useRef } from 'react';
import { View, Text,Button,Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';

export default function WebviewContainer() {
  const [selectedImage, setSelectedImage] = useState('');
  const webviewRef = useRef()
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64:true
    });

    if (!result.canceled) {
      setSelectedImage('data:image/png;base64,'+ result.assets[0].base64);
    }
  };
  const source=/*html*/`
  <!DOCTYPE html>
  <html>
    <head>
      <script async src="https://docs.opencv.org/3.4/opencv.js" onload="onOpenCVReady();"></script>
    </head> 
    <body>
      <img id="img" crossorigin="anonymous" src='${selectedImage}' alt = 'test'/>
      <script type="text/javascript">
        function onFunctionsReady(){
          window.ReactNativeWebView.postMessage('functions ready');
        }
        let img = document.getElementById('img');
        function onOpenCVReady(){
          cv['onRuntimeInitialized']=()=>{
            try {
              let image_1 = remove_noise(img)
              window.ReactNativeWebView.postMessage('safe');
            } catch(e){
              window.ReactNativeWebView.postMessage(e.toString());
            }
          }
        }
      </script>
    </body>
  </html>
  `


  return (
    <View style={{ flexDirection:'column',backgroundColor: 'black',flex:1, justifyContent:'center', alignItems: 'center',padding:40}}>
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && (
          <WebView
            style={{
              marginTop: 20,
              width: 600,
              height:'auto',
              flex: 1
            }}
            ref={webviewRef}
            injectedJavaScriptBeforeContentLoaded={require('/Users/kimhyeongseok/Documents/planote/src/components/functions.js')}
            source={{html: source}} 
            onMessage={(event) => console.log("HTML->webview:",event.nativeEvent.data)}
            domStorageEnabled={true}
          />)}
        
    </View>
    )
  }