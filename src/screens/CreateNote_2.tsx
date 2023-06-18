import React, { useRef,useState } from 'react';
import { WebView } from 'react-native-webview';
import OpenCVWeb from '../components/HTML'
import {ActivityIndicator,Text,Dimensions} from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { gql, useMutation } from '@apollo/client';
import { TouchableOpacity } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const _SafeAreaView = styled.SafeAreaView`
flex: 1;
justify-content: flex-start;
align-items: center;
`;

const CREATENOTE_MUTATION = gql`
  mutation createNote($title: String!, $noteArray: String!, $imgArray:String!) {
    createNote(title: $title, noteArray: $noteArray, imgArray: $imgArray) {
      ok
      error
    }
  }
`;

export default function CreateNote_2({navigation,route}:any) { 

  let [text,setText]= useState('악보 데이터 추출중')
  let [done, setDone] = useState<Boolean>(false)
  const { width, height } = Dimensions.get('window');

  async function cropImage(base64:string,top:number,bot:number,noteOriginW:number,noteOriginH:number) {
    const croppedImage = await ImageManipulator.manipulateAsync(
      base64,
      [
        {
          crop: {
            originX: 0,
            originY: top,
            width: height/(noteOriginH/noteOriginW), //윈도우 높이에 따라 이미지 너비는 변경될 것. 추후 추가연구 필요
            height: bot-top,
          }
        },
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    return croppedImage.uri
  }  
  const createCroppedArr= async (noteArr:string,base64:string)=>{
    let noteArray= JSON.parse(noteArr)  
    let [noteOriginW,noteOriginH] = noteArray[0]  
    let lineArea = noteArray[1]  
    const ratio =  noteOriginW /( height/(noteOriginH/noteOriginW))//추후 추가연구 필요
    var croppedImgs:any[]=[];
    for (let i =0; i<lineArea.length; i++){
      let croppedImg = await cropImage(base64,lineArea[i][0]/ratio,lineArea[i][1]/ratio,noteOriginW,noteOriginH)
      let height= lineArea[i][1]/ratio - lineArea[i][0]/ratio
      croppedImgs=[...croppedImgs,[croppedImg,height]];
    }
    return JSON.stringify(croppedImgs)
  }

  const onMessage = async (e:any)=> {  
    const { type, data : noteArr } = JSON.parse(e.nativeEvent.data);
    if(type ==="noteInfo"){
      console.log("1. 계이름 인식 과정 성공 -> 2.createNote 실행, noteName==",route.params.noteName)
      setText('악보 생성중');
      let croppedImgArr= await createCroppedArr(noteArr,imgsArray[0])     //이미 전달하는 과정에서 [0]로 세분화하고 넘겼으므로, createCroppedArr에는 img base64string이 맞음
      createNote({variables:{
        title:route.params.noteName,
        noteArray:noteArr,
        imgArray:croppedImgArr
      }});
    } else if (type === "debug"){  
      console.log("2. inside HTMLasdf==",noteArr)
    } else {
      console.log("?")
    }
  }
  
  const onCompleted = (data: any) => {
    const {
      createNote: { ok },
    } = data;
    console.log(data);

    if (ok) {
      console.log('2.createNote 성공! 3.독보창으로 이동');
      setText('악보생성 완료');
      setDone(true);
    }
  };

  const [createNote] = useMutation(CREATENOTE_MUTATION, {
    onCompleted,
    onError: (e:any)=> {
      console.log(JSON.stringify(e, null, 2));
    }
  });

  const webviewRef = useRef(null); //var notes = {};
  var imgsArray : string[]=[];

  for (let i=0; i<route.params.imgsArray.length; i++){ // notes.base64 = route.params.data[i] // notes.id = (i + 1);
    imgsArray.push(route.params.imgsArray[i]);
  }
  const source = OpenCVWeb(imgsArray);
  const refreshSignal:Boolean = true
  const navigateHome =()=> {
    navigation.navigate('Note',{refreshSignal});
  }
  
  return ( 
    <>
      <WebView 
        style={{opacity:0, position:'absolute'}} 
        ref={webviewRef} 
        source={{html: source}} 
        onMessage={onMessage}
        domStorageEnabled={true}
      />

      <_SafeAreaView>
        {done ===true ? (
          <>
        <Text style={{fontSize:24}}>악보추가를 완료했습니다</Text>
          <TouchableOpacity onPress={navigateHome}>
            <Text style={{color:'#4894ebff', fontSize:16, padding:12}}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </>
        ): (
        <>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={{marginTop:12}}>{text}</Text>
        </>
        )
        }
      </_SafeAreaView>

    </>
  )
}