import React, { useRef,useState } from 'react';
import { WebView } from 'react-native-webview';
import OpenCVWeb from '../components/HTML'
import {ActivityIndicator,Text} from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { gql, useMutation } from '@apollo/client';
import { TouchableOpacity } from 'react-native';

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

  const onMessage = (e:any)=> {  
    const { type, data : noteArr } = JSON.parse(e.nativeEvent.data);
    if(type ==="noteInfo"){
      console.log("1. 계이름 인식 과정 성공 -> 2.createNote 실행, noteName==",route.params.noteName)
      console.log("noteArr",noteArr)
      setText('악보 생성중');
      createNote({variables:{
        title:route.params.noteName,
        noteArray:noteArr,
        imgArray:imgsArray[0]
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