import React, { useState,useEffect } from 'react';
import { Text,Image,ScrollView, SafeAreaView, View,TextInput, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styled from 'styled-components/native';
import { colors } from '../../colors';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';

export const Title = styled.Text`
  margin-top: 4%;
  margin-bottom: 4%;
  font-size: 32;
`;

const Input = ({ innerRef, ...data }: any) => {
  return (
    <TextInput
      ref={innerRef}
      style={{height:50}}
      placeholderTextColor={'rgba(0,0,0,0.6)'}
      {...data}
    />
  );
};

const DeleteButton= styled.TouchableOpacity`
position: absolute;
top: -6px;
right: -6px;
`

export const Button = styled.TouchableOpacity`
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

export default function CreateNote_1({navigation}:any) {
  const { register, handleSubmit, setValue } = useForm();
  const [imgsArray, setImgsArray] = useState<string[]>([]);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1000, 1414],
      quality: 1,
      base64:true
    });

    if (!result.canceled) {
      setImgsArray([...imgsArray,'data:image/png;base64,'+ result.assets[0].base64]);
      //console.log(imgArray.length)
      //Webview가 렌더링되면서 계산절차로 넘어가는 단계
    };
  };
  const handleDelete = (index:number) => {
    const newImages = [...imgsArray];
    newImages.splice(index, 1);
    setImgsArray(newImages);
    console.log(imgsArray.length);
  };
  
  const onValid=(data:any)=> {
    let noteName= data.noteName;
    navigation.navigate('CreateNote_2',{imgsArray,noteName})
  }

  useEffect(() => {
    register('noteName', {
      required: true,
    });
  }, [register])
  
  return (
    <SafeAreaView style={{ flexDirection:'column',backgroundColor: 'white',padding:'4%',height:'100%'}}>
      <Title>이름을 설정해주세요</Title>
        <Input
          autoFocus
          placeholder='악보 이름'
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={()=>Keyboard.dismiss()}
          onChangeText={(text: string) => setValue('noteName', text)}
        />
      <Title>이미지를 선택해주세요</Title>
        <Text style= {{ fontSize:24,fontWeight:'700',paddingHorizontal:20 }}>
            선택된 이미지들
        </Text>
      <ScrollView
      scrollEventThrottle={16}
      style={{paddingHorizontal:20}}
      horizontal={true}
      indicatorStyle={'white'}
      >{imgsArray.map((img,id)=> {
        return (
          <View style={{height:230,marginTop:20,marginRight:20}}>
              <View style={{height:'100%',width:160,borderColor:'#747474',borderWidth:1}}>
                  <Image source={{uri:img}} style={{flex:1,width:undefined,height:undefined,resizeMode:'cover'}}></Image>
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
      <Button onPress={selectImage}>
          <Ionicons
              name='add-outline'
              color='white'
              size={50}
            />
        </Button>
        <Button onPress={handleSubmit(onValid)}>
          <Ionicons
              name='chevron-forward-outline'
              color='white'
              size={42}
          />
        </Button>
      </View>
    </SafeAreaView>
    )
  }