import { Avatar, Box, Card, IconButton, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import React, { useContext, useState } from 'react'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AuthContext from '../context/AuthContext';
import RecorderContext from '../context/RecorderContext';
import { BASE_URL } from '../constants/api_url'



type RecorderCardProps = {
    id: number
    text: string
}

// declare global {
//     interface Window {
//         webkitAudioContext: typeof AudioContext
//     }
// }


const RecorderCard = ({ id, text }: RecorderCardProps) => {

    let { authTokens, logoutUser } = useContext(AuthContext)
    const { startRecording, stopRecording } = useContext(RecorderContext)
    const [isRecording, setIsRecording] = useState(false)
    

    const getMask = async (buffer: Buffer, blob: Blob) => {

        let formData = new FormData()
        const soundFile = blob
        console.log(soundFile)

        formData.append('sound_file', soundFile)
        formData.append('sentence_id', String(id))

        let response = await fetch(`${BASE_URL}/getmask/`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
            body: formData
        })
        let data = await response.json()

        if (response.status === 200) { 
            console.log(data.mask) 

        }
        else if (response.statusText === "Unauthorized") { logoutUser() }
    }


    return (
        <Box m={1} pt={1}>

            <Card>
                <ListItem key={id}
                    secondaryAction={
                        <>
                            {(!isRecording) ? (
                                <Tooltip title="start recording">
                                    <IconButton
                                        aria-label="start recording audio"
                                        onClick={() => { startRecording(); setIsRecording(true) }}
                                        size="large"
                                        color="error">
                                        <MicIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="stop recording">
                                    <IconButton
                                        aria-label="stop recording audio"
                                        onClick={() => { stopRecording(getMask); setIsRecording(false) }}
                                        size="large"
                                        color="secondary">
                                        <MicOffIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar>
                            <ArrowForwardIosIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={text}
                        secondary={isRecording && 'Speak Now'}
                    />
                </ListItem>
            </Card>
        </Box>
    );
}

export default RecorderCard