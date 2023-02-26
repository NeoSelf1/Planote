import React, { createContext, useCallback, useContext, useRef } from 'react'
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import RNFS from "react-native-fs";
import UUIDGenerator from "react-native-uuid-generator";

const source =`<!DOCTYPE html>
<html lang="en">
    <head> 
        <script async src="https://docs.opencv.org/3.4/opencv.js"></script>
        <!--script async src="./opencv.js"></script-->
        <script>
            var canvas;
            
            var ctx;
            var image = new Image();
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
                window.ReactNativeWebView.postMessage(JSON.stringify({type: "onImageLoad", data: ""}));
            };

            function onload() {
                canvas = document.getElementById("c");
                ctx = canvas.getContext("2d");
                window.ReactNativeWebView.postMessage(JSON.stringify({type: "onload", data: ""}));
            }

            function loadImage(base64, width, height) {
                canvas.width = width;
                canvas.height = height;
                ctx.canvas.width = width;
                ctx.canvas.height = height;
                ctx.clearRect(0, 0, width, height);
                image.src = "data:image/png;base64," + base64;
            }

            function crop(points, size) {
                let src = cv.imread("c");
                let dst = new cv.Mat();
                let dsize = new cv.Size(size.cols, size.rows);
                let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points);
                let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, size.cols - 1, 0, 0, size.rows - 1, size.cols - 1, size.rows - 1]);
                let M = cv.getPerspectiveTransform(srcTri, dstTri);

                cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
                canvas.width = size.cols;
                canvas.height = size.rows;
                ctx.canvas.width = size.cols;
                ctx.canvas.height = size.rows;
                ctx.clearRect(0, 0, size.cols, size.rows);
                cv.imshow("c", dst);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "crop",
                    data: canvas.toDataURL()
                }));
                src.delete();
                dst.delete();
                M.delete();
                srcTri.delete();
                dstTri.delete();
            }
        </script>
    </head>
    <body onload="onload()">
        <canvas id="c"></canvas>
    </body>
<html>`

export interface OpenCVContextProps {
    setCallback: (callback: ((props: {uri: string}) => void) | undefined) => void;
    imageLoad: (uri: string, imageWidth: number, imageHeight: number) => Promise<void>;
    imageUnload: () => void;
}
const dummyFunction = () => {}
const asyncDummyFunction = async () => {}

export const OpenCVContext = createContext<OpenCVContextProps>({
    setCallback: dummyFunction,
    imageLoad: asyncDummyFunction,
    imageUnload: dummyFunction,
});

interface ContextProviderProps {
    children: any
};

export const OpenCVProvider = ({ children }: ContextProviderProps) => {
    // const {setIsLoading} = useLoading();
    const webviewRef = useRef<WebView>(null);
    const webviewLoaded = useRef<boolean>(false);
    const imageInWebviewLoaded = useRef<boolean>(false);

    const callback = useRef<((props: {uri: string}) => void) | undefined>(undefined);
    //uri string을 다루는 함수를 callback으로 사용?
    const setCallback = useCallback((f: ((props: {uri: string}) => void) | undefined) => {
        callback.current = f;
    }, []);
    const imageLoad = useCallback(async (uri: string, imageWidth: number, imageHeight: number) => {
        imageInWebviewLoaded.current = false;
        const base64 = await RNFS.readFile(uri, 'base64');
        webviewRef.current?.injectJavaScript(`loadImage("${base64}",${imageWidth},${imageHeight});`);
    }, []);
    const imageUnload = useCallback(() => {
        imageInWebviewLoaded.current = false;
    }, []);
    const onMessage = useCallback(async (e: WebViewMessageEvent) => {
        const { type, data } = JSON.parse(e.nativeEvent.data) as {type: 'onload' | 'onImageLoad' | 'crop', data: string};
        if(type === 'onload') {
            webviewLoaded.current = true;
        }
        else if(type === 'onImageLoad') {
            imageInWebviewLoaded.current = true;
        }
        else {
            const output = `file://${RNFS.CachesDirectoryPath}/opencv_${await UUIDGenerator.getRandomUUID()}.jpg`;
            const exist = await RNFS.exists(output);
            if(exist) {
                await RNFS.unlink(output);
            }
            // await RNFS.writeFile(output, data.split("data:image/png;base64,")[1], 'base64');
            await RNFS.writeFile(output, data.slice(22, data.length), 'base64');
            if(callback.current) {
                // 콜백 안에서 setIsLoading(false); 실행
                callback.current({uri: output});   
            }
        }
    }, []);

    return (
        <OpenCVContext.Provider value={{setCallback, imageLoad, imageUnload}}>
            {children}
            <WebView
                onMessage={onMessage}
                ref={webviewRef}
                originWhitelist={['file://*', 'http://*', 'https://*']}
                style={{position: 'absolute', width:0, height: 0, top: 0, left: 0}}
                javaScriptEnabled={true}
                source={{html:source}}/>
        </OpenCVContext.Provider>
    )
}

export const useOpenCV = () => {
    return useContext(OpenCVContext);
}