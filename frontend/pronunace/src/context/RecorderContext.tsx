import { createContext, useRef, useState } from "react";
const MicRecorder = require('mic-recorder-to-mp3');


const RecorderContext = createContext<any>(null)

export const RecorderProvider = ({ children }: any) => {

    var [isRecording, setIsRecording] = useState(false)
    var recorder = useRef<typeof MicRecorder | null>(new MicRecorder({ bitRate: 128 }))

    function startRecording(): void {
        if (recorder.current == null) {
            recorder.current = MicRecorder({ bitRate: 128 })
        }

        recorder.current!.start().then(() => {
            setIsRecording(true)
        }).catch((e: any) => {
            console.error(e);
        });
        console.log('Recording...');
    }

    function stopRecording(callback: (buffer: Buffer, blob: Blob) => void): void {
        recorder.current!
            .stop()
            .getMp3()
            .then(([buffer, blob]: any) => {
                setIsRecording(false)
                callback(buffer, blob)
            })
            .catch((e: any) => {
                alert('We could not retrieve your message');
                console.log(e);
            })
    }

    var contextData = {
        startRecording: startRecording,
        stopRecording: stopRecording,
        isRecording: isRecording,
    }


    return <RecorderContext.Provider value={contextData}>{children}</RecorderContext.Provider>

}

export default RecorderContext
