import List from '@mui/material/List'
import React, { useContext, useEffect, useState } from 'react'
import RecorderCard from '../components/RecorderCard'
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
    <div>
      <p>Practice Sentences Page</p>
      <RecorderProvider>
        <List>
          {
            challenges.map((challenge: ChallengeProps) =>
              <RecorderCard id={challenge.id} text={challenge.text} key={challenge.id} />
            )
          }
        </List>
      </RecorderProvider>
    </div>
  )
}

export default PracticeSentencesPage