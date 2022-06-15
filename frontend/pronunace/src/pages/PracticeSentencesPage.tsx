import { Box, Typography } from '@mui/material'
import List from '@mui/material/List'
import React, { useContext, useEffect, useState } from 'react'
import PracticeSentenceRecorderCard from '../components/RecorderCards/PracticeSentenceRecorderCard'
import { BASE_URL } from '../constants/api_url'
import AuthContext from '../context/AuthContext'
import { RecorderProvider } from '../context/RecorderContext'

type ChallengeProps = {
  id: number,
  text: string,
  story?: number
}

const PracticeSentencesPage = () => {

  let [challenges, setChallenges] = useState<any>([])
  let { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {

    const getChallenges = async () => {
      let response = await fetch(`${BASE_URL}/sentences/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/Json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
      let data = await response.json()

      if (response.status === 200) { setChallenges(data) }
      else if (response.statusText === "Unauthorized") { logoutUser() }
    }

    getChallenges()
  }, [authTokens.access, logoutUser])

  return (
    <Box>
      <Typography>Practice Sentences Page</Typography>
      <RecorderProvider>
        <List>
          {
            challenges.map((challenge: ChallengeProps) =>
              <Box key={challenge.id}>
                <PracticeSentenceRecorderCard index={challenge.id} text={challenge.text} />
              </Box>
            )
          }
        </List>
      </RecorderProvider>
    </Box>
  )
}

export default PracticeSentencesPage