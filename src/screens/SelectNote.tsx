import React, { useState } from 'react';
import { Button, Image, View ,Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SelectNote: React.FC = ({navigation}:any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log("result",result)
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      navigation.navigate('WebViewContainer',{imageUri: result.assets[0].uri})
    }
  };

  return (
    <View style={{ flexDirection:'column',backgroundColor: 'black', flex: 1, justifyContent:'center', alignItems: 'center' }}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{width: 200, height: 200 }} />
      )}
      <Button title="Select Image" onPress={selectImage} />
    </View>
  );
};

export default SelectNote