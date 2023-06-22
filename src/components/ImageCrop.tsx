import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from "react-native";

export const createCroppedArr= async (noteArr:string, base64:string, screenHeight:number,screenWidth:number)=>{
    let noteArray= JSON.parse(noteArr)  
    let [noteOriginW,noteOriginH] = noteArray[0]  
    let lineArea = noteArray[1]  
    const ratio = noteOriginW / (screenHeight/(noteOriginH/noteOriginW))//추후 추가연구 필요
    var croppedImgs:any[] = [];
    let myWidth =screenWidth;
    let myHeight =screenHeight;
    Image.getSize(base64, (width, height) => {
        myWidth=width;
        myHeight=height;
        console.log("width:",width,"height:",height)
        console.log("screenWidth:",screenWidth,"screenHeight:",screenHeight)
        console.log("noteOriginW:",noteOriginW,"noteOriginH:",noteOriginH)
      });
    for (let i =0; i<lineArea.length; i++){
        let croppedImg = await cropImage(base64,lineArea[i][0],lineArea[i][1],myWidth,myHeight,noteOriginH)
        let lineAreaH= lineArea[i][1]/ratio - lineArea[i][0]/ratio
        croppedImgs=[...croppedImgs,[croppedImg,lineAreaH]];
    }
    return croppedImgs
}
const cropImage= async (base64:string,top:number,bot:number,width:number,height:number,noteOriginH:number) =>{
    
    const croppedImage = await ImageManipulator.manipulateAsync(
        base64,
        [
        {
            crop: {
            originX: 0,
            originY: (top/noteOriginH)*height,//
            width: width, //확정
            height: (bot-top)*(noteOriginH/height),
            }
        },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    return croppedImage.uri
}  