import React,{useState} from 'react';
import { SafeAreaView,Text,Dimensions, Image,View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Button } from './CreateNote_1';

const Title = styled.Text`
  font-weight: 600;
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
  let [pitchFilter,setPitchFilter]=useState(false);
  const noteStringTop = ['도','레','미','파','솔','라','시'] //교수님 왜 저에게 이런걸 시키시는건가요

  const { width, height } = Dimensions.get('window');

  const imgObjArr :any[]= [];
  const pitchTextArr :any[] = [];
  // console.log("imgArry :",imgArray)//[uri,height]

  let pitches = noteArray[1] 
  let [noteOriginW,noteOriginH] = noteArray[0] 
  for (let i=0; i<pitches.length; i++){
    const pitchTextArrPerLine = [];
    let maxLen=0;
    for(let j=0; j<pitches[i].length; j++){
      //pitches[i][j][0] == 줄기 x좌표
      //pitches[i][j][1] == 계이름 어레이
      let pitchTextArrPerStem = pitches[i][j][1];
      if(pitchFilter){
        pitchTextArrPerStem=pitchTextArrPerStem.filter((item:number)=>(item<=9 ||20<=item))
      }
      if(maxLen<pitchTextArrPerStem.length){
        maxLen=pitchTextArrPerStem.length;
      }
      pitchTextArrPerLine.push([
        <Text style={{
          textAlign: "center",
          position:'absolute',
          lineHeight: 16,
          top:2,
          width:12,  
          left:    (pitches[i][j][0]/noteOriginW)*width-6,
          color:'black'
          }} 
          key={`${i}_${j}`}> 
          {pitchTextArrPerStem.map((item:number)=> (
            i%2==0? noteStringTop[(item+6)%7]:noteStringTop[(item+1)%7]
          ))}
        </Text>
        ]
      );
    }
    pitchTextArr.push(
      <View style={{height:maxLen*17,backgroundColor: i%2==0? 'white':'#E7E7E7'}}>
      {pitchTextArrPerLine}
      </View>
      )
  }
  for (let i=0; i<imgArray.length; i++){
    let myHeight = 50;
    Image.getSize(imgArray[i],(width,height)=> {
      myHeight=height
    })
    imgObjArr.push(
      <Image
        key={i}
        source={{uri: imgArray[i]}}
        style={{resizeMode:'contain',width, height:myHeight,backgroundColor:'white'}}
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
      <ScrollView> 
      <Title>{title}</Title>
      <Note/>
      </ScrollView>
      <Button style={{backgroundColor:"#e2e2e2",position:'absolute',top:'4%',right:'4%'}} onPress={()=>setPitchFilter(!pitchFilter)}>
        <Text style={{color:'#727272'}}>필터모드</Text>
      </Button>
    </SafeAreaView>
  )
}

export default ViewNote0617