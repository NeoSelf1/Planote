import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from "react-native";

export const createCroppedArr= async (noteArr:string, base64:string, screenHeight:number,screenWidth:number)=>{
    let noteArray= JSON.parse(noteArr)  
    let [noteOriginW,noteOriginH] = noteArray[0]  
    let lineArea = noteArray[1]  
    var croppedImgs:any[] = [];
    let myWidth =screenWidth;
    let myHeight =screenHeight;

    Image.getSize(base64, (width, height) => {
        myWidth=width;
        myHeight=height;
    })
    for (let i =0; i<lineArea.length; i++){//왜 처음 cropImage 호출시에만 Image.getSize 반환값 적용이 안되는가?
        let croppedImg = await cropImage(base64,lineArea[i][0],lineArea[i][1],myWidth,myHeight,noteOriginH)
        croppedImgs=[...croppedImgs,croppedImg];
    }
    return croppedImgs;
}

const cropImage= async (base64:string,top:number,bot:number,width:number,height:number,noteOriginH:number) =>{
    const croppedImage = await ImageManipulator.manipulateAsync(
        base64,
        [
        {
            crop: {
            originX: 0,
            originY: (top/noteOriginH)*height,
            width: width, //확정
            height: (bot-top)*(height/noteOriginH)
            }
        },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    return croppedImage.uri
}  