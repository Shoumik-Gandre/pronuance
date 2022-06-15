import { Box, Typography } from '@mui/material'
import List from '@mui/material/List'
import React, { useContext, useEffect, useState } from 'react'
import PracticeSentenceRecorderCard from '../components/RecorderCards/PracticeSentenceRecorderCard'
import { GET_PRACTICE_SENTENCES } from '../constants/api_url'
import AuthContext from '../context/AuthContext'
import { RecorderProvider } from '../context/RecorderContext'

type SentenceProps = {
  id: number,
  text: string,
  story?: number
}

const PracticeSentencesPage = () => {

  let [sentences, setSentences] = useState<any>([])
  let { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {

    const getSentences = async () => {
      let response = await fetch(GET_PRACTICE_SENTENCES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/Json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
      let data = await response.json()

      if (response.status === 200) { setSentences(data) }
      else if (response.statusText === "Unauthorized") { logoutUser() }
    }

    getSentences()
  }, [authTokens.access, logoutUser])

  return (
    <Box>
      <Typography variant='h4'>Practice Sentence Pronunciation</Typography>
      <RecorderProvider>
        <List>
          {
            sentences.map((sentence: SentenceProps) =>
              <Box key={sentence.id} m={1}>
                <PracticeSentenceRecorderCard index={sentence.id} text={sentence.text} />
              </Box>
            )
          }
        </List>
      </RecorderProvider>
    </Box>
  )
}

export default PracticeSentencesPage