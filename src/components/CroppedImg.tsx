import React,{useState,useEffect} from 'react'
import { Dimensions, Image } from 'react-native'


const CroppedImg = ({uri}:any) => {
    const { width, height } = Dimensions.get('window');
    const [imageHeight, setImageHeight] = useState<number>(height/12);  
    useEffect(() => {
        Image.getSize(uri, (width, height) => {
        setImageHeight(height);
        });
    }, [uri]);
    console.log("imageHeight:",imageHeight,uri)
    return (
        <Image 
        source={{uri}}
        style={{resizeMode:'contain',width, height:imageHeight,backgroundColor:'white'}}
        />
  )
}

export default CroppedImg