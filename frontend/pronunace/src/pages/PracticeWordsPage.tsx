import { Box, List, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import PracticeWordRecorderCard from '../components/RecorderCards/PracticeWordRecorderCard'
import { GET_PRACTICE_WORDS } from '../constants/api_url'
import AuthContext from '../context/AuthContext'
import { RecorderProvider } from '../context/RecorderContext'

interface WordsProps {
  id: number,
  text: string
}

const PracticeWordsPage = () => {

  let [words, setWords] = useState<WordsProps[]>([])
  let { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {

    const getWords = async () => {
      let response = await fetch(GET_PRACTICE_WORDS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/Json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
      let data = await response.json()

      if (response.status === 200) { setWords(data) }
      else if (response.statusText === "Unauthorized") { logoutUser() }
    }

    getWords()
  }, [])

  return (
    <Box>
      <Typography variant='h4'>Practice Word Pronunciation</Typography>
      <RecorderProvider>
        <List>
          {
            words.map(
              (word: WordsProps) =>
                <Box key={word.id} mt={2}>
                  <PracticeWordRecorderCard index={word.id} word={word.text} />
                </Box>
            )
          }
        </List>
      </RecorderProvider>
    </Box>
  )
}

export default PracticeWordsPage