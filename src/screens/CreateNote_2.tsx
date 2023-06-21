import React, { useRef,useState } from 'react';
import { WebView } from 'react-native-webview';
import OpenCVWeb from '../components/HTML'
import {ActivityIndicator,Text,Dimensions} from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { gql, useMutation } from '@apollo/client';
import { TouchableOpacity } from 'react-native';
import { createCroppedArr } from '../components/ImageCrop';
import { WebViewNativeEvent } from 'react-native-webview/lib/WebViewTypes';

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

  let croppedImgArr:any;
  let noteArr:string;

  const onMessage = async (e:any)=> {  
    const { type, data } = JSON.parse(e.nativeEvent.data);
    noteArr=data;
    if(type ==="noteInfo"){
      console.log("1. 계이름 인식 과정 성공 -> 2.createNote 실행, noteName==",route.params.noteName)
      setText('악보 생성중');
      croppedImgArr= await createCroppedArr(noteArr,imgsArray[0],height)     //이미 전달하는 과정에서 [0]로 세분화하고 넘겼으므로, createCroppedArr에는 img base64string이 맞음
      createNote({variables:{
        title:route.params.noteName,
        noteArray:noteArr,
        imgArray:JSON.stringify(croppedImgArr)
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
    update(cache, { data: { createNote } }) {
      if (createNote.ok) {
        const newNote = {
          id: createNote.id, // Assign a unique local ID or use the server-generated ID if available
          title: route.params.noteName,
          noteArray: noteArr,
          imgArray: croppedImgArr
        };
        cache.modify({
          fields: {
            notes(existingNotes = []) {
              const newNoteRef = cache.writeFragment({
                data: newNote,
                fragment: gql`
                  fragment NewNote on Note {
                    id
                    title
                    noteArray
                    imgArray
                  }
                `,
              });
              return [...existingNotes, newNoteRef];
            },
          },
        });
        // console.log(cache)
      }
    },
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