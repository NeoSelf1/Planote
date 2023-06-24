import React,{useState} from 'react';
import { SafeAreaView,Text,Dimensions, Image,View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import CroppedImg from '../components/CroppedImg';
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

  const imgObjArr : any[]= [];
  const pitchTextArr : any[] = [];
  for (let i =0; i<noteArray.length;i++){ //2
    let pitches = noteArray[i][1] 
    let noteOriginW = noteArray[i][0]
    //pitches ==모든 라인들에 대한 [[[row,[pitches]], [row,[pitches]],...],[[row,[pitches]], [row,[pitches]],...]]
    //[[[407, [Array]], [435, [Array]], [521, [Array]], [565, [Array]], [661, [Array]], [687, [Array]], [763, [Array]], [805, [Array]], [900, [Array]], [927, [Array]], [1004, [Array]], [1029, [Array]], [1126, [Array]], [1150, [Array]], [1228, [Array]], [1270, [Array]]], [[382, [Array]], [470, [Array]], [486, [Array]], [590, [Array]], [636, [Array]], [712, [Array]], [727, [Array]], [830, [Array]], [875, [Array]], [951, [Array]], [978, [Array]], [1055, [Array]], [1099, [Array]], [1177, [Array]], [1201, [Array]], [1295, [Array]]], [[285, [Array]], [333, [Array]], [359, [Array]], [402, [Array]], [461, [Array]], [486, [Array]], [507, [Array]], [530, [Array]], [583, [Array]], [616, [Array]], [724, [Array]], [750, [Array]], [807, [Array]], [837, [Array]], [886, [Array]], [932, [Array]], [999, [Array]], [1025, [Array]], [1048, [Array]], [1073, [Array]], [1168, [Array]], [1215, [Array]], [1230, [Array]], [1279, [Array]]], [[238, [Array]], [262, [Array]], [285, [Array]], [310, [Array]], [333, [Array]], [387, [Array]], [461, [Array]], [548, [Array]], [616, [Array]], [641, [Array]], [662, [Array]], [699, [Array]], [773, [Array]], [861, [Array]], [932, [Array]], [955, [Array]], [999, [Array]], [1015, [Array]], [1073, [Array]], [1120, [Array]], [1143, [Array]], [1168, [Array]], [1189, [Array]], [1204, [Array]], [1265, [Array]]], [[225, [Array]], [319, [Array]], [347, [Array]], [373, [Array]], [483, [Array]], [520, [Array]], [599, [Array]], [652, [Array]], [697, [Array]], [776, [Array]], [807, [Array]], [833, [Array]], [861, [Array]], [912, [Array]], [976, [Array]], [1030, [Array]], [1090, [Array]], [1152, [Array]], [1184, [Array]], [1210, [Array]], [1261, [Array]]], [[238, [Array]], [264, [Array]], [291, [Array]], [319, [Array]], [347, [Array]], [400, [Array]], [426, [Array]], [447, [Array]], [483, [Array]], [539, [Array]], [572, [Array]], [625, [Array]], [697, [Array]], [724, [Array]], [750, [Array]], [861, [Array]], [912, [Array]], [976, [Array]], [1030, [Array]], [1060, [Array]], [1090, [Array]], [1152, [Array]], [1230, [Array]]], [[238, [Array]], [285, [Array]], [312, [Array]], [361, [Array]], [391, [Array]], [416, [Array]], [454, [Array]], [479, [Array]], [504, [Array]], [528, [Array]], [553, [Array]], [579, [Array]], [629, [Array]], [673, [Array]], [697, [Array]], [722, [Array]], [747, [Array]], [798, [Array]], [847, [Array]], [893, [Array]], [969, [Array]], [986, [Array]], [1006, [Array]], [1060, [Array]], [1087, [Array]], [1127, [Array]], [1214, [Array]], [1238, [Array]], [1263, [Array]], [1288, [Array]]], [[238, [Array]], [262, [Array]], [275, [Array]], [454, [Array]], [479, [Array]], [504, [Array]], [604, [Array]], [673, [Array]], [697, [Array]], [722, [Array]], [761, [Array]], [823, [Array]], [893, [Array]], [918, [Array]], [933, [Array]], [1032, [Array]], [1060, [Array]], [1127, [Array]], [1152, [Array]], [1177, [Array]], [1201, [Array]], [1214, [Array]], [1274, [Array]]], [[225, [Array]], [278, [Array]], [342, [Array]], [384, [Array]], [446, [Array]], [565, [Array]], [618, [Array]], [671, [Array]], [750, [Array]], [791, [Array]], [821, [Array]], [898, [Array]], [1018, [Array]], [1071, [Array]], [1124, [Array]], [1256, [Array]], [1288, [Array]]], [[238, [Array]], [264, [Array]], [291, [Array]], [317, [Array]], [342, [Array]], [394, [Array]], [446, [Array]], [472, [Array]], [498, [Array]], [525, [Array]], [604, [Array]], [671, [Array]], [697, [Array]], [712, [Array]], [801, [Array]], [831, [Array]], [898, [Array]], [925, [Array]], [951, [Array]], [978, [Array]], [993, [Array]], [1057, [Array]], [1124, [Array]], [1150, [Array]], [1177, [Array]], [1203, [Array]], [1230, [Array]], [1288, [Array]]]]
    for (let j=0; j<pitches.length; j++){//매 음정들의 line에 대해 pitches를 본격적으로 건드림
      //pitches[j]==[[238, [5]], [264, [9]], [291, [9]], [317, [12]], [342, [12]], [394, [9]], [446, [6]], [472, [10]], [498, [13]], [525, [14]], [604, [6]], [671, [8]], [697, [11]], [712, [15]], [801, [8]], [831, [7]], [898, [6]], [925, [10]], [951, [13]], [978, [14]], [993, [15]], [1057, [6]], [1124, [3]], [1150, [7]], [1177, [10]], [1203, [11]], [1230, [11]], [1288, [12]]]
      const pitchTextArrPerLine : any[] = [];
      let maxLen=0;
      //각 라인에 대해 라인을 공유하는 모든 음정들을 pitchTextArrPerLine 배열에 모두 저장.
      for(let l=0; l<pitches[j].length; l++){//각 라인에 대해
        //pitches[j][l][0] == 줄기 x좌표  , pitches[j][l][1] == 계이름 어레이
        let pitchTextArrPerStem = pitches[j][l][1];
        if(pitchFilter){
          pitchTextArrPerStem=pitchTextArrPerStem.filter((item:number)=>(item<=9 ||20<=item))
        }
        //추후 음정 string이 출력되는 공간 할당을 위해 maxLen 수치를 각 라인에 대해 한번씩 계산
        if(maxLen<pitchTextArrPerStem.length){
          maxLen=pitchTextArrPerStem.length;
        }
        // console.log(pitches[j][l][0]/noteOriginW)
        pitchTextArrPerLine.push([
          <Text style={{
            textAlign: "center",
            position:'absolute',
            lineHeight: 16,
            top:2,
            width:12,  
            left:    (pitches[j][l][0]/noteOriginW)*width-6,
            color:'black'
            }} 
            key={`${j}_${l}`}> 
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
  }
  console.log(imgArray)

  for (let i=0; i<imgArray.length; i++){
    imgObjArr.push(
      <CroppedImg uri={imgArray[i]}/>
    )
  }

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