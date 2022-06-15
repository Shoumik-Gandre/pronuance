import { Box, Card, IconButton, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import React, { useContext, useState } from 'react'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import AuthContext from '../context/AuthContext';
import RecorderContext from '../context/RecorderContext';
import { GET_MISPRONUNCIATION_SENTENCEMASK_CHALLENGES } from '../constants/api_url'
import WordScaffold from './WordScaffold';



type RecorderScaffoldCardProps = {
    id: number
    text: string
}


const RecorderScaffoldCard = ({ id, text }: RecorderScaffoldCardProps) => {

    let { authTokens, logoutUser } = useContext(AuthContext)
    const { startRecording, stopRecording } = useContext(RecorderContext)
    const [isRecording, setIsRecording] = useState(false)
    const [words, setWords] = useState<string[] | null>(null)
    const [mask, setMask] = useState<boolean[] | null>(null)


    const getMask = async (buffer: Buffer, blob: Blob) => {

        let formData = new FormData()
        const soundFile = blob
        console.log(soundFile)

        formData.append('sound_file', soundFile)
        formData.append('sentence_id', String(id))

        let response = await fetch(GET_MISPRONUNCIATION_SENTENCEMASK_CHALLENGES, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
            body: formData
        })
        let data = await response.json()

        if (response.status === 200) {
            console.log(data.mask)
            console.log(data.words)

            setMask(data.mask)
            setWords(data.words)
        }
        else if (response.statusText === "Unauthorized") { logoutUser() }
    }


    return (
        <Box m={1} pt={1}>

            <Card>
                <ListItem key={id}>
                    <ListItemAvatar>
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
                    </ListItemAvatar>
                    <ListItemText
                        primary={text}
                        secondary={isRecording && 'Speak Now'}
                    />
                </ListItem>
                {
                    words
                    && mask
                    && words.length
                    && mask.length
                    && <WordScaffold words={words} mask={mask} />
                }
            </Card>
        </Box>
    );
}

export default RecorderScaffoldCard