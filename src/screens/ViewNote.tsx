import React, { useState } from 'react';
import { ScrollView,View,Image,Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../../colors';
import styled from 'styled-components/native';
/*
height : 화면 전체 높이 -> 진짜 찐도배기로 보이는 가로,세로
NoteInfo[0][1]: 이미지 원본의 높이
width*1.414 :화면 상 보이는 이미지의 높이
NoteInfo[0]== (이미지 가로길이, 높이)
NoteInfo[1]== 각 오선보의 높이
NoteInfo[2]== 계이름들의 정보
line=note[0], pitch = note[1][0], x좌표 = note[1][1]
width*(note[1][1]/NoteInfo[0][0])
*/

const NoteText = styled(Text)`
  color:   ${colors.green};
  font-weight: bold;
  text-align: center;
  position: absolute;
  border-width:2px;
  border-color:red;
  width:12px;
`;

const ViewNote: React.FC = ({route:{params}}:any) => {
  const noteStringTop = ['도','레','미','파','솔','라','시'] //교수님 왜 저에게 이런걸 시키시는건가요
  const { width, height } = Dimensions.get('window');
  const NoteInfo = JSON.parse(params.data);
  const screenRatio = (width*1.414)/NoteInfo[0][1];
  const blankBottom = height-(width*1.414);
  const base64Note= params.selectedImage;
  
  const textComponents = NoteInfo[2].map((text:any) => (
    text.map((note:any, noteId:number)=> (
      <NoteText style={{
        left:    (note[1][1]/NoteInfo[0][0])*width,
        bottom:  width*1.414 - NoteInfo[1][note[0]*5]*(width*1.414/height)
        }} key={noteId}> 
        {note[0]%2===1 ? 
        (note[1][0].map((item:number)=> (
          noteStringTop[(item+5)%7]
        ))):
        (note[1][0].map((item:number)=> (
          noteStringTop[(item+3)%7]
        )))}
      </NoteText> 
    // <PitchText
    //   myKey = {noteId}
    //   text={noteString[note[1][0].toString()]}
    //   x={note[1][1]}
    //   y={note[0]*200+200}
    //   >
    // </PitchText>
    )
    )

  ));
  return (
    <View style={{flex:1,width: '100%', height: NoteInfo[0][1], backgroundColor: 'black'}}>
      <Image style={{resizeMode:'contain',width:'100%',height:NoteInfo[0][1]*screenRatio,aspectRatio:0.70721}} source = {{uri: base64Note}}/>
      {textComponents}
    </View>
  );
};

export default ViewNote