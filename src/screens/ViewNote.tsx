import React, { useState } from 'react';
import { View,Image,Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../../colors';


const styles = StyleSheet.create({
  text: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
/*
height : 화면 전체 높이 -> 진짜 찐도배기로 보이는 가로,세로
NoteInfo[0][1]: 이미지 원본의 높이
width*1.414 :화면 상 보이는 이미지의 높이
*/
const ViewNote: React.FC = ({route:{params}}:any) => {
  const noteStringTop = ['도','레','미','파','솔','라','시'] //교수님 왜 저에게 이런걸 시키시는건가요
  const { width, height } = Dimensions.get('window');
  const NoteInfo = JSON.parse(params.data);
  const screenRatio = (width*1.414)/NoteInfo[0][1];
  const blankBottom = height-(width*1.414);
  console.log(NoteInfo[0][1]);
  console.log(width);

  // console.log(NoteInfo[0]) //->1.00059...
  //console.log(screenRatio)  // -> 0.8961774608833432
  //NoteInfo[0]== (이미지 가로길이, 높이)
  //NoteInfo[1]== 각 오선보의 높이
  //NoteInfo[2]== 계이름들의 정보
  const base64Note= params.selectedImage;
  // console.log("Note Info =", params.array)
  const textComponents = NoteInfo[2].map((text:any) => (
    text.map((note:any, noteId:number)=> (
      //line=note[0], pitch = note[1][0], x좌표 = note[1][1]
      //console.log(note) note[0]*90+NoteInfo[1][0]
      //width*(note[1][1]/NoteInfo[0][0])
      //note[1][1]/NoteInfo[0][0]값이 1 이상이다??
      //530?
      <Text style={{
        left:   (note[1][1]/NoteInfo[0][1])*width*screenRatio,
        bottom: width*1.414 - NoteInfo[1][note[0]*5]*screenRatio+blankBottom, 
        color:  colors.green,
        fontWeight:'bold',
        textAlign: 'center',
        position: 'absolute',
        borderWidth:2,
        borderColor:'red',
        width:14,
        }} key={noteId}> 
        {note[0]%2===1 ? 
        (note[1][0].map((item:number)=> (
          noteStringTop[(item+5)%7]
        ))):
        (note[1][0].map((item:number)=> (
          noteStringTop[(item+3)%7]
        )))}
      </Text> 
    // <PitchText
    //   myKey = {noteId}
    //   text={noteString[note[1][0].toString()]}
    //   x={note[1][1]}
    //   y={note[0]*200+200}
    //   >
    // </PitchText>
    )
    )

  ));//저는 똥쟁이입니다
  return (
    <View style={{flex:1,width: '100%', height: 9999999, backgroundColor: 'black'}}>
      <Image style={{resizeMode:'contain',width:'100%',height:NoteInfo[0][1]*screenRatio,aspectRatio:0.70721}} source = {{uri: base64Note}}/>
      {textComponents}
    </View>
  );
};

export default ViewNote // 형석이는 교수님이 미워요