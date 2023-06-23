import React, { useRef,useState } from 'react';
import { WebView } from 'react-native-webview';
import OpenCVWeb from '../components/HTML'
import {ActivityIndicator,Text,Dimensions} from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { gql, useMutation } from '@apollo/client';
import { TouchableOpacity } from 'react-native';
import { createCroppedArr } from '../components/ImageCrop';

const _SafeAreaView = styled.SafeAreaView`
position: absolute;
top: 500px;
left: 0px;
right: 0px;
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

let croppedImgsArr:string[]=[];
let noteDatasArr:string[][]=[];

export default function CreateNote_2({navigation,route}:any) { 
  let [text,setText]= useState('악보 데이터 추출중')
  let [done, setDone] = useState<Boolean>(false)
  const webviewRef = useRef(null); //var notes = {};
  let {width,height}=Dimensions.get("window")
  var imgsArray : string[]=[];
  for (let i=0; i<route.params.imgsArray.length; i++){ // notes.base64 = route.params.data[i] // notes.id = (i + 1);
    imgsArray.push(route.params.imgsArray[i]);
  }
  console.log("test");

  let croppedImgs:any;

  const onMessage = async (e:any)=> {  
    const { type, data } = JSON.parse(e.nativeEvent.data);
    //처음 시작은 당연히 0번째 이미지를 계산해야하기에 인자로 0을 삽입
    
    if (type === "OnOpenCVReady"){  
      InsertImgsToWebview(0);
    }else if(type ==="noteInfo"){
      let noteData = JSON.parse(data)
      let myId= noteData[3]
      // console.log("myId:",myId,"noteData:",noteData)
      // console.log("typeof(myId):",typeof(myId),"typeof(noteData):",typeof(noteData))
      console.log(myId+1,"번째 페이지의 계이름 인식 과정 성공",)
      // //데이터 축적과정
      //image.uri : string을 보관하고 있는 array
      croppedImgs= await createCroppedArr(data,imgsArray[myId],height,width);
      croppedImgsArr.push(...croppedImgs);//string 반환
      //spread 연산자 ...를 push 대상으로 하면, 최종적으로 모든 원소들이 같은 배열 내 같은 위계에 놓이게 됨.
      noteDatasArr.push([noteData[0][0],noteData[2]]);
      //
      InsertImgsToWebview(myId+1);  
    } else {  
      console.log("ERROR in onMessage / inside HTML==",data);
    }
  }
  const InsertImgsToWebview = async (id:number)=> {//마지막은 3
    if(webviewRef.current && id<imgsArray.length){ //한 이미지에 대한 NoteData를 계산하는 과정 -> 반환값은 onMessage에서 확인가능하다
      webviewRef.current.injectJavaScript(`ExtractNoteData("${imgsArray[id]}",${id});`);
      setText((id+1)+'번째 악보 계산 중');
    } else if (id>=imgsArray.length){ //모든 이미지에 대한 Data 계산이 완료한 경우
      console.log("모든 악보의 계산이 완료되었습니다");
      setText('계산한 악보 저장 중');
      createNote({variables:{
        title:route.params.noteName,
        noteArray:JSON.stringify(noteDatasArr),
        imgArray:JSON.stringify(croppedImgsArr)
      }});
    } else{
      console.log("Error in InsertImgsToWebview")
    }
  }
  
  const onCompleted = (data: any) => {
    const {
      createNote: { ok,id },
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
          noteArray: JSON.stringify(noteDatasArr),
          imgArray: JSON.stringify(croppedImgsArr)
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

  const navigateHome =()=> {
    navigation.navigate('Note');
  }
  return ( 
    <>
      <WebView 
        style={{opacity:0}} 
        ref={webviewRef} 
        source={{html: OpenCVWeb()}} 
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