import { Box, CircularProgress, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tooltip } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import React, { useContext, useState } from 'react'
import RecorderContext from '../../context/RecorderContext';
import AuthContext from '../../context/AuthContext';
import { GET_MISPRONUNCIATION_SENTENCEMASK_CHALLENGES } from '../../constants/api_url';
import WordScaffold from '../WordScaffold';
import tts from '../../utils/tts';


interface ChallengeSentenceScaffoldRecorderCardProps {
  index: number,
  text: string
}


const ChallengeSentenceScaffoldRecorderCard = ({ index, text }: ChallengeSentenceScaffoldRecorderCardProps) => {

  const { startRecording, stopRecording } = useContext(RecorderContext)
  let { authTokens, logoutUser } = useContext(AuthContext)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mask, setMask] = useState<boolean[]>([])
  const [words, setWords] = useState<string[]>([])

  const getMask = async (buffer: Buffer, blob: Blob) => {

    let formData = new FormData()
    const soundFile = blob
    console.log(soundFile)

    formData.append('sound_file', soundFile)
    formData.append('sentence_id', String(index))

    try {
      setIsLoading(true)
      let response = await fetch(GET_MISPRONUNCIATION_SENTENCEMASK_CHALLENGES, {
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
    catch { }
    finally {
      setIsLoading(false)
    }
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
              onClick={() => tts(text)}
            >
              <PlayCircleFilledIcon />
            </IconButton>
          </Tooltip>}
      >
        <ListItemButton role={undefined} onClick={() => { }} dense>
          <ListItemIcon>

            <>
              {
                (isLoading) ? <CircularProgress /> :
                  (!isRecording) ? (
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
                  )
              }
            </>
          </ListItemIcon>
          <ListItemText
            id={String(index)}
            primary={text}
          />
        </ListItemButton>
      </ListItem>
      <Box ml={3}>
        {
          (words
            && mask
            && words.length
            && mask.length) ?
            <WordScaffold words={words} mask={mask} />
            : null
        }
      </Box>
    </Paper>
  )
}

export default ChallengeSentenceScaffoldRecorderCard