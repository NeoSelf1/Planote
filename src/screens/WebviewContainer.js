import React, { useState,useRef,useEffect } from 'react';
import { Text,Image,ScrollView, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import OpenCVWeb from '../components/HTML'
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Title = styled.Text`
  margin-top: 4%;
  margin-bottom: 4%;
  font-size: 32;
`;

const DeleteButton= styled.TouchableOpacity`
position: absolute;
top: -6;
right: -6;
`

const Button = styled.TouchableOpacity`
  background-color: ${colors.green};
  padding: 15px 10px;
  border-radius: 3px;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background-color: ${colors.green};
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default function WebviewContainer({navigation}) {
  const [imgArray, setImgArray] = useState([]);
  const [selectDone,setSelectDone]= useState(false)
  const [loading, setLoading] = useState(0);
  const webviewRef = useRef()
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1000, 1414],
      quality: 1,
      base64:true
    });

    if (!result.canceled) {
      setImgArray([...imgArray,'data:image/png;base64,'+ result.assets[0].base64]);
      // console.log(imgArray.length)
      //Webview가 렌더링되면서 계산절차로 넘어가는 단계
    }
  };
  const source = OpenCVWeb(imgArray)
  
  const onMessage = (e)=> {
    const { type, data } = JSON.parse(e.nativeEvent.data)
    if(type ==="noteInfo"){
      console.log("Information successully transfered to ViewNote")
      // navigation.navigate('ViewNote',{data,selectedImage})
      //Temporary Change for Test
      setSelectedImage(false)
      setLoading(0)
    } else {
      console.log(data)
    }
  }
  const handleDelete = (index) => {
    const newImages = [...imgArray];
    newImages.splice(index, 1);
    setImgArray(newImages);
    console.log(imgArray.length);
  };
  return (
    <SafeAreaView style={{ flexDirection:'column',backgroundColor: 'white',padding:'4%',height:'100%'}}>
      <Title>이미지를 선택해주세요</Title>
        <Text style= {{fontSize:24,fontWeight:'700',paddingHorizontal:20}}>
            선택된 이미지들
          </Text>
      <ScrollView
      scrollEventThrottle={16}
      style={{backgroundColor:"black"}}
      horizontal={true}
      indicatorStyle
      >{imgArray.map((img,id)=> {
        return (
          <View style={{height:130,marginTop:20,marginRight:40}}>
              <View style={{height:'100%',width:100,borderColor:'#747474',borderWidth:1}}>
                  <Image source={{uri:img}} style={{flex:1,width:null,height:null,resizeMode:'cover'}}></Image>
                  <DeleteButton onPress={()=>handleDelete(id)}>
                    <Ionicons
                    name='close-outline'
                    color='black'
                    size={50}
                    />
                  </DeleteButton>
              </View>
          </View>
        )
      })}
      </ScrollView>
      <View style={{display:"flex", flexDirection:'row',justifyContent:'space-between'}}>
      <Button title="Select Image" onPress={selectImage}>
          <Ionicons
              name='add-outline'
              color='white'
              size={50}
            />
        </Button>
        <Button title="Change" onPress={function(){console.log('asdf')}}>
          <Ionicons
              name='chevron-forward-outline'
              color='white'
              size={42}
          />
        </Button>
      </View>
      {loading ===1 && (
          <Text style={{color:'white',fontSize:24,marginTop:200}}>Loading</Text>
      )}
      {selectDone? //Temporary Change for Test
          <WebView
            style={{display:'none'}}
            ref={webviewRef}
            source={{html: source}} 
            onMessage={onMessage}
            domStorageEnabled={true}
          />:(null)
      }
    </SafeAreaView>
    )
  }