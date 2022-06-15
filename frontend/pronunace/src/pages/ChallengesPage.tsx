import { Box, List, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import RecorderScaffoldCard from '../components/RecorderScaffoldCard'
import AuthContext from '../context/AuthContext'
import { RecorderProvider } from '../context/RecorderContext'
import { BASE_URL } from '../constants/api_url'

type ChallengeProps = {
  id: number,
  text: string,
  story?: number
}

const ChallengesPage = () => {
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
  }, [])



  return (
    <Box>
      <Typography variant='h4'>Challenges</Typography>
      <RecorderProvider>
        <List>
          {
            challenges.map(
              (challenge: ChallengeProps) =>
                <Box key={challenge.id}>
                  <RecorderScaffoldCard id={challenge.id} text={challenge.text} />
                </Box>
            )
          }
        </List>
      </RecorderProvider>
    </Box>
  )
}

export default ChallengesPage