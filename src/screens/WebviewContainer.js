import React, { useState,useRef } from 'react';
import { View, Text,Button,Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import OpenCVWeb from '../components/Webview'
export default function WebviewContainer({navigation}) {
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(0);
  const webviewRef = useRef()
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1000, 1414],
      quality: 1,
      base64:true
    });

    if (!result.canceled) {
      setSelectedImage('data:image/png;base64,'+ result.assets[0].base64);
      setLoading(1)
    }
  };
  const source = OpenCVWeb(selectedImage)
  const onMessage = (e)=> {
    const { type, data } = JSON.parse(e.nativeEvent.data)
    if(type ==="noteInfo"){
      console.log("Information successully transfered to ViewNote")
      navigation.navigate('ViewNote',{data,selectedImage})
      setSelectedImage(false)
      setLoading(2)
    } else {
      console.log(data)
    }
  }
  return (
    <View style={{ flexDirection:'column',backgroundColor: 'black',flex:1, justifyContent:'center', alignItems: 'center'}}>
      {loading ===1 && (
          <Text style={{color:'white',fontSize:24,marginTop:200}}>Loading</Text>
        )
      }
      {selectedImage?(
        <>
          <WebView
            style={{display:'none'}}
            ref={webviewRef}
            source={{html: source}} 
            onMessage={onMessage}
            domStorageEnabled={true}
          />
        </>
        ):(
        <Button title="Select Image" onPress={selectImage} />
        ) 
      }
    </View>
    )
  }