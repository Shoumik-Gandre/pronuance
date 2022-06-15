import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tooltip, Box, Typography } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import React, { useContext, useState } from 'react'
import RecorderContext from '../../context/RecorderContext';
import AuthContext from '../../context/AuthContext';
import { GET_MISPRONUNCIATION_SENTENCEMASK_PRACTICE } from '../../constants/api_url';

interface PracticeSentenceRecorderCardProps {
    index: number,
    text: string
}


const PracticeSentenceRecorderCard = ({ index, text }: PracticeSentenceRecorderCardProps) => {

    const { startRecording, stopRecording } = useContext(RecorderContext)
    let { authTokens, logoutUser } = useContext(AuthContext)
    const [isRecording, setIsRecording] = useState(false)
    const [mask, setMask] = useState<boolean[]>([])
    const [words, setWords] = useState<string[]>([])

    const getMask = async (buffer: Buffer, blob: Blob) => {

        let formData = new FormData()
        const soundFile = blob
        console.log(soundFile)

        formData.append('sound_file', soundFile)
        formData.append('sentence_id', String(index))

        let response = await fetch(GET_MISPRONUNCIATION_SENTENCEMASK_PRACTICE, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
            body: formData
        })
        let data = await response.json()

        if (response.status === 200) {
            console.log(data.mask)
            console.log(data.sentence)
            setMask(data.mask)
            setWords(data.words)
        }
        else if (response.statusText === "Unauthorized") { logoutUser() }
    }

    return (
        <Paper>
            <ListItem
                key={index}
                secondaryAction={
                    <Tooltip title="correct pronunciation">
                        <IconButton
                            edge="end"
                            aria-label="comments"
                            size="large"
                            color="success"
                        >
                            <PlayCircleFilledIcon />
                        </IconButton>
                    </Tooltip>}
            >
                <ListItemButton role={undefined} onClick={() => { }} dense>
                    <ListItemIcon>

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
                    </ListItemIcon>
                    <ListItemText
                        primaryTypographyProps={<Box></Box>}
                        id={String(index)}
                        primary={text}
                    />
                </ListItemButton>
            </ListItem>
            {
                mask 
                && <Box><Typography>Incorrect Words:</Typography></Box>
                && mask.map((value, index) => {
                    if (!value) return <Box><Typography>{words[index]}</Typography></Box>
                    return <></>
                }
                )
            }
        </Paper>
    )
}

export default PracticeSentenceRecorderCard