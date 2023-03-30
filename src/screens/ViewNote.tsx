import React, { useState } from 'react';
import { View,Image,Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';


const styles = StyleSheet.create({
  text: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ViewNote: React.FC = ({route:{params}}:any) => {
  const noteString = ['도','레','미','파','솔','라','시'] //교수님 왜 저에게 이런걸 시키시는건가요

  const { width, height } = Dimensions.get('window');
  const NoteInfo = JSON.parse(params.data)
  console.log(NoteInfo)
  //NoteInfo[0]== (이미지 가로길이, 세로길이)
  //NoteInfo[1]== 각 오선보의 높이
  //NoteInfo[2]== 계이름들의 정보
  const base64Note= params.selectedImage
  // console.log("Note Info =", params.array)
  const textComponents = NoteInfo[2].map((text:any) => (
    text.map((note:any, noteId:number)=> (
      // line=note[0], pitch = note[1][0], x좌표 = note[1][1]
      // console.log(note) 
      <Text style={{left:note[1][1]/2,top:note[0]*90+100, 
        color: 'black',
        fontWeight: '600',
        textAlign: 'center',
        position: 'absolute',
        // borderColor:'red',
        // borderWidth:2
        }} key={noteId}> 
        {/* {noteString[note[1][0].toString()]} */}
        {note[1][0]}
        {/* {note[0]} */}
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
  const findLayout = (layout:any)=> {
    const {x, y, width, height} = layout; 
  }
  return (
    <View onLayout={(event)=> {findLayout(event.nativeEvent.layout)}} style={{width:'100%',height:'100%',backgroundColor: 'black'}}>
      <Image style={{resizeMode:'contain',width:'100%',height:undefined, aspectRatio:0.70721}} source = {{uri: base64Note}}/>
      {textComponents}
    </View>
  );
};

export default ViewNote // 형석이는 교수님이 미워요