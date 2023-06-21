import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from "react-native";
export const createCroppedArr= async (noteArr:string, base64:string, screenHeight:number,screenWidth:number)=>{
    let noteArray= JSON.parse(noteArr)  
    let [noteOriginW,noteOriginH] = noteArray[0]  
    let lineArea = noteArray[1]  
    const ratio = noteOriginW / (screenHeight/(noteOriginH/noteOriginW))//추후 추가연구 필요
    var croppedImgs:any[] = [];
    Image.getSize(base64, (width, height) => {
        console.log("width:",width,"height:",height)
        console.log("screenWidth:",screenWidth,"screenHeight:",screenHeight)
        console.log("noteOriginW:",noteOriginW,"noteOriginH:",noteOriginH)
      });
    for (let i =0; i<lineArea.length; i++){
        let croppedImg = await cropImage(base64,lineArea[i][0]/ratio,lineArea[i][1]/ratio,noteOriginW,noteOriginH,screenHeight,screenWidth)
        let lineAreaH= lineArea[i][1]/ratio - lineArea[i][0]/ratio
        croppedImgs=[...croppedImgs,[croppedImg,lineAreaH]];
    }
    return croppedImgs
}
const cropImage= async (base64:string,top:number,bot:number,noteOriginW:number,noteOriginH:number,screenHeight:number,screenWidth:number) =>{
    
    const croppedImage = await ImageManipulator.manipulateAsync(
        base64,
        [
        {
            crop: {
            originX: 0,
            originY: top,
            width: screenWidth, //윈도우 높이에 따라 이미지 너비는 변경될 것. 추후 추가연구 필요
            height: bot-top,
            }
        },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    return croppedImage.uri
}  