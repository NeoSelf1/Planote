import React, { useState,useRef } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import OpenCVWeb from '../components/HTML'

export default function CreateNote_2({route}) { 
  const [loading, setLoading] = useState(0);
  const webviewRef = useRef();
  console.log("1.route.params.data.length==",route.params.data.length)

  //var notes = {};
  var notesArray=[];
  for (let i=0; i<route.params.data.length; i++){
    // notes.base64 = route.params.data[i]
    // notes.id = (i + 1);
    notesArray.push(route.params.data[i]);
  } 
  console.log(notesArray.length)
  const source = OpenCVWeb(notesArray)
   
  const onMessage = (e)=> {  
    const { type, data } = JSON.parse(e.nativeEvent.data) 
    if(type ==="noteInfo"){
      console.log("Information successully transfered to ViewNote")
      // navigation.navigate('ViewNote',{data,selectedImage})
      //Temporary Change for Test
    } else if (type=== "length") { 
      console.log("2. inside HTML, length==",data)
    }
    else {  
      console.log("2. inside HTML==",data)
    }
  } 
  return ( 
    <SafeAreaView style={{width:'100%',height:'100%'}}>
      <Text>CreateNote_2</Text>  
      <WebView 
        style={{width:"120%",height:"120%"}} 
        ref={webviewRef} 
        source={{html: source}} 
        onMessage={onMessage}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  )
}