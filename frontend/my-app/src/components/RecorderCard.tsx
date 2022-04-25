import { Avatar, Box, Card, IconButton, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import React, { useContext } from 'react'
import { useReactMediaRecorder } from "react-media-recorder";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AuthContext from '../context/AuthContext';
import useRecorder from "../utils/useRecorder";



type RecorderCardProps = {
    id: number
    text: string
}


const RecorderCard = ({ id, text }: RecorderCardProps) => {


    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ audio: true });

    let { authTokens, logoutUser } = useContext(AuthContext)



    const getMask = async () => {

        let formData = new FormData()
        const soundFile = await handleSave()
        console.log(soundFile)
        
        formData.append('sound_file', soundFile)
        formData.append('sentence_id', String(id))



        let response = await fetch('http://127.0.0.1:8000/app/api/getmask/', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/Json',
                // 'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: formData
        })
        let data = await response.json()

        if (response.status === 200) { console.log(data.mask) }
        else if (response.statusText === "Unauthorized") { logoutUser() }
    }


    const handleSave = async () => {
        const audioBlob = await fetch(mediaBlobUrl!).then((r) => r.blob());
        const audioFile = new File([audioBlob], 'voice.wav', { type: 'audio/wav' });
        return audioFile
    };


    const handleStopRecording = async () => {
        stopRecording()
        getMask()
    }

    return (
        <Box m={1} pt={1}>
            <Card>
                <ListItem key={id}
                    secondaryAction={
                        (status === 'idle' || status === 'stopped') ? (
                            <Tooltip title="start recording">
                                <IconButton aria-label="start recording audio" onClick={startRecording} size="large" color="error">
                                    <MicIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        )
                            : (
                                <Tooltip title="stop recording">
                                    <IconButton aria-label="stop recording audio" onClick={handleStopRecording} size="large" color="secondary">
                                        <MicOffIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            )
                    }
                >
                    <ListItemAvatar>
                        <Avatar>
                            <ArrowForwardIosIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={text}
                        secondary={(status === 'recording') && 'Speak Now'}
                    />
                    <audio src={mediaBlobUrl!} controls />
                </ListItem>
            </Card>
        </Box>
    );
}

export default RecorderCard