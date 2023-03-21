import React, { useState,useRef } from 'react';
import { View, Text,Button } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';

export default function WebviewContainer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const webviewRef = useRef()
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const source=/*html*/`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <script async src="https://docs.opencv.org/3.4/opencv.js" onload="onOpenCvReady();"></script>
      <script>
        /*var Module = {
          onRuntimeInitialized() {
            img.src= "data:image/jpeg," + '${selectedImage}'
            let srcMat = cv.matFromImageData(img.src);//문제의 원인
            window.ReactNativeWebView.postMessage(img.src);
          }
        }*/
        //window.ReactNativeWebView.postMessage("${selectedImage}");

        function onOpenCvReady(){
          window.ReactNativeWebView.postMessage('openCV ready');
        }
      </script>  
    </head>
    <body>   
      <img id="selected-image" src="${selectedImage}" />
      <canvas id="canvas"></canvas>    
    </body>
  </html>
  `
  const convertToBlackAndWhite = () => {
    const injectedJavaScript = `
      function convertToBlackAndWhite(imageData) {
        // Load the image data into OpenCV.js Mat object
        let srcMat = cv.matFromImageData(imageData);
        const img_gray= new cv.Mat(); 

        // Convert the image to grayscale
        //cv.cvtColor(srcMat, srcMat, cv.COLOR_RGBA2GRAY);

        // Apply adaptive thresholding to get a black and white image
        //cv.adaptiveThreshold(srcMat, srcMat, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 15, 2);

        // Return the converted image data
        return cv.matToImageData(srcMat);
      }
      try {
      const img = document.getElementById('selected-image');
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const convertedImageData = convertToBlackAndWhite(imageData);
      // context.putImageData(convertedImageData, 0, 0);
      // window.ReactNativeWebView.postMessage(JSON.stringify({ imageData: convertedImageData }));

      window.ReactNativeWebView.postMessage('Safe');
      } catch(e){
        window.ReactNativeWebView.postMessage(e.toString());
      }
    `;
    setTimeout(() => {webviewRef.current?.injectJavaScript(injectedJavaScript)}, 500);
    

    // setTimeout(() => {
    //   setConvertedImage(selectedImage);
    // }, 500);

    // return injectedJavaScript;
  };

  return (
    <View style={{ flexDirection:'column',backgroundColor: 'black', flex: 1, justifyContent:'center', alignItems: 'center' }}>
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && (
        <>
        <Text style={{color:'white'}}>selectedImage</Text>
        <WebView
          ref={webviewRef}
          source={{html: source}} 
          onMessage={(event) => console.log("HTML->webview:",event.nativeEvent.data)}
          // onMessage={(event) => setConvertedImage(event.nativeEvent.data)}
          injectedJavaScript={convertToBlackAndWhite()}
        />
        </>
      )}
      {convertedImage && (
        <View>
          <Text style={{color:'white'}}>ConvertedImage</Text>
          <WebView
            source={{
              html: `
                <canvas id="canvas" width="300" height="300"></canvas>
                <img id="selected-image" src="${selectedImage}" style="display: none;" />
              `,}}
          />
        </View>
      )}
    </View>
    )
  }