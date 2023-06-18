import React,{useState} from 'react';
import { SafeAreaView,Text,Dimensions, Image,View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const ViewNote0617 =  ({route}) => {
  let noteArray= JSON.parse(route.params.noteArr)  
  let imgArray= JSON.parse(route.params.imgArr)  
  console.log(imgArray)
  const { width, height } = Dimensions.get('window');
  // let [croppedImgArr,setCroppedImgArr]=useState([]);
  let [noteOriginW,noteOriginH] = noteArray[0]
  let lineArea = noteArray[1]
  let pitches = noteArray[2]
  const ratio =  noteOriginW /( height/(noteOriginH/noteOriginW))//추후 추가연구 필요
  // console.log("noteOriginW,noteOriginH = ",noteOriginW,noteOriginH)
  // console.log("Windowwidth, Windowheight = ",width, height)
  // console.log("lineArea",lineArea)
  //원본이미지의 너비*(noteOriginH/noteOriginW) = windowHeight //윈도우의 높이에 따라 출력될 원본이미지의 너비도 변경된다.
    return (
    <SafeAreaView style={{flex:1,justifyContent:'flex-start'}}>
      {/* <DynamicImages/> */}
      <Text>0617_ViewNote</Text>
    </SafeAreaView>
  )
}

export default ViewNote0617

