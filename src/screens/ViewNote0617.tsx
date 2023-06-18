import React,{useState} from 'react';
import { SafeAreaView,Text,Dimensions, Image,View } from 'react-native';
import styled from 'styled-components/native';

// const NoteText = styled(Text)`
//   font-weight: 700;
//   text-align: center;
//   line-height: 14;
//   position: absolute;
//   /* border-width:2px;
//   border-color:red; */
//   width:12px;
// `;

const ViewNote0617 =  ({route}:any) => {
  let noteArray= JSON.parse(route.params.noteArr)  
  let imgArray= JSON.parse(route.params.imgArr)  
  const noteStringTop = ['도','레','미','파','솔','라','시'] //교수님 왜 저에게 이런걸 시키시는건가요

  console.log(imgArray)//[uri,height]

  const { width, height } = Dimensions.get('window');
  let [noteOriginW,noteOriginH] = noteArray[0]
  let pitches = noteArray[2]
  //const ratio =  noteOriginW /( height/(noteOriginH/noteOriginW))//추후 추가연구 필요
  //원본이미지의 너비*(noteOriginH/noteOriginW) = windowHeight //윈도우의 높이에 따라 출력될 원본이미지의 너비도 변경된다.
  const Note = ( {imgs,pitches} :any) => {
    const images = [];
    const pitches2 = [];
    for (let i = 0; i < imgs.length; i++) {
      for (let j=0;j<pitches[i].length;j++){
        //pitches[i][j][0] == 줄기 x좌표
        //pitches[i][j][1] == 계이름 어레이
        //imgs = croppedImg의 uri 링크들
        console.log(pitches[i][j][1])
        // pitches2.push(
        //   <Text style={{
        //     textAlign: "center",
        //     lineHeight: 14,
        //     width:12,
        //     color:'black'
        //     }} 
        //     key={`${i}_${j}`}> 
        //     {pitches[i][j][1].map((item:number)=> (
        //       noteStringTop[(item+3)%7]
        //     ))
        //     }
        //   </Text>
        // );
      }
      images.push(
          <Image
            key={i}
            source={{uri: imgs[i][0]}}
            style={{resizeMode:'contain',width, height:imgs[i][1]}}
          />
          //, pitches2
      );
    }
    return (
    <View>
      {images}
    </View>
    )
  };

    return (
    <SafeAreaView>
      <Note imgs={imgArray} pitches = {pitches}/>
    </SafeAreaView>
  )
}

export default ViewNote0617

