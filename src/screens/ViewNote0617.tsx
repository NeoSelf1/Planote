import React,{useState} from 'react';
import { SafeAreaView,Text,Dimensions, Image,View } from 'react-native';
import styled from 'styled-components/native';

const Title = styled(Text)`
  font-weight: 700;
  text-align: center;
  font-size: 54px;
  background-color: white;
  padding:20px 0px;
`;
//원본이미지의 너비*(noteOriginH/noteOriginW) = windowHeight //윈도우의 높이에 따라 출력될 원본이미지의 너비도 변경된다.

const ViewNote0617 =  ({route}:any) => {
  let noteArray= JSON.parse(route.params.noteArr)  
  let imgArray= JSON.parse(route.params.imgArr)  
  let title= route.params.title
  const noteStringTop = ['도','레','미','파','솔','라','시'] //교수님 왜 저에게 이런걸 시키시는건가요
  let [noteOriginW,noteOriginH] = noteArray[0]
  const { width, height } = Dimensions.get('window');

  const imgObjArr :any[]= [];
  const pitchTextArr :any[] = [];
  // console.log("imgArry :",imgArray)//[uri,height]

  let pitches = noteArray[2]  
  for (let i=0; i<pitches.length; i++){
    const pitchTextArrPerLine = [];
    let maxLen=0;
    for(let j=0; j<pitches[i].length; j++){
      //pitches[i][j][0] == 줄기 x좌표
      //pitches[i][j][1] == 계이름 어레이
      if(maxLen<pitches[i][j][1].length){
        maxLen=pitches[i][j][1].length;
      }
      pitchTextArrPerLine.push([
        <Text style={{
          textAlign: "center",
          position:'absolute',
          lineHeight: 16,
          top:4,
          width:12,  
          left:    (pitches[i][j][0]/noteOriginW)*width-6,
          color:'black'
          }} 
          key={`${i}_${j}`}> 
          {pitches[i][j][1].map((item:number)=> (
            i%2==0? noteStringTop[(item+6)%7]:noteStringTop[(item+1)%7]
          ))
          }
        </Text>
        ]
      );
    }
    pitchTextArr.push(
      <View style={{height:maxLen*16,backgroundColor: i%2==0? 'white':'#E7E7E7'}}>
      {pitchTextArrPerLine}
      </View>
      )
  }
  for (let i=0; i<imgArray.length; i++){
    imgObjArr.push(
      <Image
        key={i}
        source={{uri: imgArray[i][0]}}
        style={{resizeMode:'contain',width, height:imgArray[i][1],backgroundColor:'white'}}
      />
    )
  }
  console.log("pitchTextArr:",pitchTextArr.length)
  console.log("imgObjArr:",imgObjArr.length)

  const Note = ()=>{
    let finalObjs:any[]=[]
    for (let i=0; i<pitchTextArr.length;i++){
      finalObjs.push(
        imgObjArr[i],
        pitchTextArr[i]     
      )
    }
    return (
      <View>
        {finalObjs}
      </View>
    )
  }

    return (
    <SafeAreaView>
      <Title>{title}</Title>
      <Note/>
    </SafeAreaView>
  )
}

export default ViewNote0617

